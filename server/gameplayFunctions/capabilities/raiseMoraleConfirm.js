const { Game, InvItem, Capability, Piece } = require("../../classes");
import { RAISE_MORALE_SELECTED } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG, GAME_DOES_NOT_EXIST } from "../../pages/errorTypes";
import { RAISE_MORALE_TYPE_ID, ALL_COMMANDER_TYPES, COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from "../../../client/src/gameData/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");

const raiseMoraleConfirm = async (socket, payload) => {
    const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

    if (payload == null || payload.selectedCommanderType == null) {
        sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedCommanderType)");
        return;
    }

    const { selectedCommanderType, invItem } = payload;

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

    //gamePhase 2 is only phase for raise morale
    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //gameSlice 0 is only slice for raise morale
    if (gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right slice (must be planning)...");
        return;
    }

    //Only the main controller (0) can use raise morale
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
    if (invItemTypeId != RAISE_MORALE_TYPE_ID) {
        sendUserFeedback(socket, "Inv Item was not a raise morale type.");
        return;
    }

    //does the commander selection make sense?
    if (!ALL_COMMANDER_TYPES.includes(selectedCommanderType)) {
        sendUserFeedback(socket, "got a negative position for raise morale.");
        return;
    }

    //insert the raise morale into the db to start using it
    if (!(await Capability.insertRaiseMorale(gameId, gameTeam, selectedCommanderType))) {
        sendUserFeedback(socket, "db failed to insert raise morale, likely already an entry for that position.");
        return;
    }

    await thisInvItem.delete();

    const gameboardPieces = await Piece.getVisiblePieces(gameId, gameTeam);
    const confirmedRaiseMorale = await Capability.getRaiseMorale(gameId, gameTeam);

    // let the client(team) know that this plan was accepted
    const serverAction = {
        type: RAISE_MORALE_SELECTED,
        payload: {
            invItem: thisInvItem,
            confirmedRaiseMorale,
            gameboardPieces
        }
    };
    socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = raiseMoraleConfirm;
