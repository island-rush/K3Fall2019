const { Game, InvItem, Capability } = require("../../classes");
import { GOLDEN_EYE_SELECTED } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG, GAME_DOES_NOT_EXIST } from "../../pages/errorTypes";
import { GOLDEN_EYE_TYPE_ID, COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from "../../../client/src/gameData/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");

const biologicalWeaponsConfirm = async (socket, payload) => {
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

    //gamePhase 2 is only phase for golden eye
    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //gameSlice 0 is only slice for golden eye
    if (gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right slice (must be planning)...");
        return;
    }

    //Only the main controller (0) can use golden eye
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
    if (invItemTypeId != GOLDEN_EYE_TYPE_ID) {
        sendUserFeedback(socket, "Inv Item was not a golden eye type.");
        return;
    }

    //does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, "got a negative position for golden eye.");
        return;
    }

    //insert the 'plan' for golden eye into the db for later use
    //let the client(team) know that this plan was accepted
    if (!(await Capability.insertGoldenEye(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, "db failed to insert golden eye, likely already an entry for that position.");
        return;
    }

    await thisInvItem.delete();

    const serverAction = {
        type: GOLDEN_EYE_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId
        }
    };
    socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = biologicalWeaponsConfirm;
