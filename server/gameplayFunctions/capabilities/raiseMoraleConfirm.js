const { Game, InvItem, Capability, Piece } = require("../../classes");
import { RAISE_MORALE_SELECTED } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG, GAME_DOES_NOT_EXIST } from "../../pages/errorTypes";
import { TYPE_NAME_IDS } from "../../../client/src/gameData/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");

const raiseMoraleConfirm = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	if (payload == null || payload.selectedPositionId == null) {
		sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedPositionId)");
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
	if (gamePhase != 2) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}

	//gameSlice 0 is only slice for raise morale
	if (gameSlice != 0) {
		sendUserFeedback(socket, "Not the right slice (must be planning)...");
		return;
	}

	//Only the main controller (0) can use raise morale
	if (gameController != 0) {
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
	if (invItemTypeId != TYPE_NAME_IDS["Raise Morale"]) {
		sendUserFeedback(socket, "Inv Item was not a raise morale type.");
		return;
	}

	//does the position make sense?
	//TODO: make these individually check against the constants (don't make an arbitrary range)
	if (selectedCommanderType < 1 || selectedCommanderType > 4) {
		sendUserFeedback(socket, "got a negative position for raise morale.");
		return;
	}

	//insert the raise morale into the db to start using it

	// if (!(await Capability.raiseMoraleInsert(gameId, gameTeam, selectedPositionId))) {
	// 	sendUserFeedback(socket, "db failed to insert raise morale, likely already an entry for that position.");
	// 	return;
	// }

	// await thisInvItem.delete();

	// await Piece.updateVisibilities(gameId);
	// const gameboardPieces = await Piece.getVisiblePieces(gameId, gameTeam);
	// const confirmedRemoteSense = await Capability.getRemoteSensing(gameId, gameTeam);

	// let the client(team) know that this plan was accepted
	const serverAction = {
		type: RAISE_MORALE_SELECTED,
		payload: {
			invItem: thisInvItem
			// confirmedRemoteSense,
			// gameboardPieces
		}
	};
	socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = raiseMoraleConfirm;
