const { Game, Piece, Plan } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { PLAN_WAS_CONFIRMED } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { CONTAINER_TYPES } from "../../../client/src/gameData/gameConstants";
import { distanceMatrix } from "../../../client/src/gameData/distanceMatrix";

const confirmPlan = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const { pieceId, plan } = payload;
	const thisGame = await new Game({ gameId }).init();

	const { gameActive, gamePhase, gameSlice } = thisGame;

	if (!gameActive) {
		socket.emit(SERVER_REDIRECT, GAME_INACTIVE_TAG);
		return;
	}

	//Must be in combat phase (2), slice 0 to make plans
	if (gamePhase != 2 && gameSlice != 0) {
		sendUserFeedback(socket, "Not the right phase/slice...looking for phase 2 slice 0");
		return;
	}

	//Does the piece exist?
	const thisPiece = await new Piece(pieceId).init();
	if (!thisPiece) {
		sendUserFeedback(socket, "Piece did not exists...refresh page?");
		return;
	}

	const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId } = thisPiece;

	//Is this piece ours? (TODO: could also check pieceType with gameController)
	if (pieceGameId != gameId || pieceTeamId != gameTeam) {
		sendUserFeedback(socket, "Piece did not belong to your team...(or this game)");
		return;
	}

	const isContainer = CONTAINER_TYPES.includes(pieceTypeId);

	//Check adjacency and other parts of the plan to make sure the whole thing makes sense
	let previousPosition = piecePositionId;
	for (let x = 0; x < plan.length; x++) {
		//make sure adjacency between positions in the plan...
		//other checks...piece type and number of moves?

		const { type, positionId } = plan[x];

		//make sure positions are equal for container type
		if (type == "container") {
			if (!isContainer) {
				sendUserFeedback(socket, "sent a bad plan, container move for non-container piece...");
				return;
			}

			if (previousPosition != positionId) {
				sendUserFeedback(socket, "sent a bad plan, container move was not in previous position...");
				return;
			}
		}

		if (distanceMatrix[previousPosition][positionId] !== 1) {
			if (type !== "container") {
				sendUserFeedback(socket, "sent a bad plan, positions were not adjacent...");
				return;
			}
		}

		previousPosition = positionId;
	}

	//prepare the bulk insert
	let plansToInsert = [];
	for (let movementOrder = 0; movementOrder < plan.length; movementOrder++) {
		let { positionId, type } = plan[movementOrder];
		let specialFlag = type == "move" ? 0 : 1; // 1 = container, use other numbers for future special flags...
		plansToInsert.push([pieceGameId, pieceTeamId, pieceId, movementOrder, positionId, specialFlag]);
	}

	//bulk insert (always insert bulk, don't really ever insert single stuff, since a 'plan' is a collection of moves, but the table is 'Plans')
	//TODO: could change the phrasing on Plan vs Moves (as far as inserting..function names...database entries??)
	await Plan.insert(plansToInsert);

	const serverAction = {
		type: PLAN_WAS_CONFIRMED,
		payload: {
			pieceId,
			plan
		}
	};
	socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = confirmPlan;
