const { Game, InvItem } = require("../classes");
const sendUserFeedback = require("./sendUserFeedback");
import { PIECE_PLACE } from "../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../client/src/redux/socketEmits";
import { BAD_REQUEST_TAG, GAME_INACTIVE_TAG } from "../pages/errorTypes";

const piecePlace = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const { invItemId, selectedPosition } = payload;

	const thisGame = await new Game({ gameId }).init();
	const { gameActive, gamePhase } = thisGame;

	if (!gameActive) {
		socket.emit(SERVER_REDIRECT, GAME_INACTIVE_TAG);
		return;
	}

	//Can only place pieces from inv during 'place reinforcements phase' (3)
	if (gamePhase != 3) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}

	// Different controllers place their own piece types? TODO: make this part of the checks...
	// if (gameController != 0) {
	// 	sendUserFeedback(socket, "Not the main controller (0)...");
	// 	return;
	// }

	const thisInvItem = await new InvItem(invItemId).init();
	if (!thisInvItem) {
		sendUserFeedback(socket, "Inv Item did not exist...");
		return;
	}

	const { invItemGameId, invItemTeamId } = thisInvItem;

	//Do they own this item?
	if (invItemGameId != gameId || invItemTeamId != gameTeam) {
		socket.emit(SERVER_REDIRECT, BAD_REQUEST_TAG);
		return;
	}

	//Other checks go here.......TODO: more checks...(position types and piece types...blah blah blah...)
	//does this positionId even exist? (lots of weird things could happen....(but probably won't...))

	const newPiece = await thisInvItem.placeOnBoard(selectedPosition); //should also check that this piece actually got created, could return null (should return null if it failed...TODO: return null if failed...)

	//TODO: Should probably also write down how the state is stored on the frontend eventually, so others know how it works
	newPiece.pieceContents = { pieces: [] }; //new pieces have nothing in them, and piece contents is required for the frontend...

	const serverAction = {
		type: PIECE_PLACE,
		payload: {
			invItemId,
			positionId: selectedPosition,
			newPiece
		}
	};

	//need to send this to the whole team
	socket.to("game" + gameId + "team" + gameTeam).emit(SERVER_SENDING_ACTION, serverAction);
	socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = piecePlace;
