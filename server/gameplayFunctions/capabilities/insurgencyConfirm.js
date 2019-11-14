const { Game, InvItem, Capability } = require("../../classes");
import { INSURGENCY_SELECTED } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG, GAME_DOES_NOT_EXIST } from "../../pages/errorTypes";
import { INSURGENCY_TYPE_ID, COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from "../../../client/src/gameData/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");

const insurgencyConfirm = async (socket, payload) => {
    const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

    if (payload == null || payload.selectedPositionId == null) {
        sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedPositionId)");
        return;
    }

    const { selectedPositionId, invItem } = payload;

    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice, game0Points, game1Points } = thisGame;

    if (!gameActive) {
        socket.emit(SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //gamePhase 2 is only phase for insurgency
    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //gameSlice 0 is only slice for insurgency
    if (gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right slice (must be planning)...");
        return;
    }

    //Only the main controller (0) can use insurgency
    if (gameController != TYPE_MAIN) {
        sendUserFeedback(socket, "Not the main controller (0)...");
        return;
    }

    const { invItemId } = invItem;

    //Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socket, "Did not have the invItem to complete this request.");
        return;
    }

    //verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId != INSURGENCY_TYPE_ID) {
        sendUserFeedback(socket, "Inv Item was not a insurgency type.");
        return;
    }

    //does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, "got a negative position for insurgency.");
        return;
    }

    //insert the 'plan' for insurgency into the db for later use
    //let the client(team) know that this plan was accepted
    if (!(await Capability.insurgencyInsert(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, "db failed to insert insurgency, likely already an entry for that position.");
        return;
    }

    await thisInvItem.delete();

    const serverAction = {
        type: INSURGENCY_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId
        }
    };
    socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = insurgencyConfirm;
