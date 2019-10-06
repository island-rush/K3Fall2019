const { Game, Piece } = require("../classes");
const sendUserFeedback = require("./sendUserFeedback");
import { GAME_INACTIVE_TAG, DELETE_PLAN } from "../../client/src/redux/actions/types";

const deletePlan = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const { pieceId } = payload;
	const thisGame = await new Game({ gameId }).init();

	const { gameActive, gamePhase, gameSlice } = thisGame;

	if (!gameActive) {
		socket.emit("serverRedirect", GAME_INACTIVE_TAG); //TODO: serverRedirect should be a constant too
		return;
	}

	//Can only change/delete plans in combat phase (2) and slice 0
	if (gamePhase != 2 && gameSlice != 0) {
		sendUserFeedback(socket, "Not the right phase/slice...looking for phase 2 slice 0");
		return;
	}

	//Does the piece exist? (And match for this game/team/controller)
	const thisPiece = await new Piece(pieceId).init();
	if (!thisPiece) {
		sendUserFeedback(socket, "Piece did not exists...refresh page?");
		return;
	}

	const { pieceGameId, pieceTeamId } = thisPiece;

	if (pieceGameId != gameId || pieceTeamId != gameTeam) {
		sendUserFeedback(socket, "Piece did not belong to your team...(or this game)");
		return;
	}

	await thisPiece.deletePlans();

	const serverAction = {
		type: DELETE_PLAN,
		payload: {
			pieceId
		}
	};
	socket.emit("serverSendingAction", serverAction); //TODO: should the other sockets for this team get the update? (in the background?)
};

module.exports = deletePlan;
