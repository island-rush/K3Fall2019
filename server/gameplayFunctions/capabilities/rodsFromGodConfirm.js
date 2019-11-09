const { Game, InvItem, Capability } = require("../../classes");
import { RODS_FROM_GOD_SELECTED } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { TYPE_NAME_IDS } from "../../../client/src/gameData/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");

const rodsFromGodConfirm = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	if (payload == null || payload.selectedPositionId == null) {
		sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedPositionId)");
		return;
	}

	const { selectedPositionId, invItem } = payload;

	const thisGame = await new Game({ gameId }).init();
	const { gameActive, gamePhase, gameSlice, game0Points, game1Points } = thisGame;

	if (!gameActive) {
		socket.emit(SERVER_REDIRECT, GAME_INACTIVE_TAG);
		return;
	}

	//gamePhase 2 is only phase for rods from god
	if (gamePhase != 2) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}

	//gameSlice 0 is only slice for rods from god
	if (gameSlice != 0) {
		sendUserFeedback(socket, "Not the right slice (must be planning)...");
		return;
	}

	//Only the main controller (0) can use rods from god
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
	if (invItemTypeId != TYPE_NAME_IDS["Rods from God"]) {
		sendUserFeedback(socket, "Inv Item was not a rods from god type.");
		return;
	}

	//does the position make sense?
	if (selectedPositionId < 0) {
		sendUserFeedback(socket, "got a negative position for rods from god.");
		return;
	}

	//insert the 'plan' for rods from god into the db for later use
	//let the client(team) know that this plan was accepted
	if (!(await Capability.rodsFromGodInsert(gameId, gameTeam, selectedPositionId))) {
		sendUserFeedback(socket, "db failed to insert rods from god, likely already an entry for that position.");
		return;
	}

	await thisInvItem.delete();

	const serverAction = {
		type: RODS_FROM_GOD_SELECTED,
		payload: {
			invItem: thisInvItem,
			selectedPositionId
		}
	};
	socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = rodsFromGodConfirm;
