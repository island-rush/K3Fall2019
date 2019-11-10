import {
	INITIAL_GAMESTATE,
	PIECES_MOVE,
	PIECE_PLACE,
	CLEAR_BATTLE,
	EVENT_BATTLE,
	REFUEL_RESULTS,
	NO_MORE_EVENTS,
	EVENT_REFUEL,
	NEW_ROUND,
	PLACE_PHASE,
	SLICE_CHANGE,
	REMOTE_SENSING_SELECTED
} from "../actions/actionTypes";
import { initialGameboardEmpty } from "./initialGameboardEmpty";

//TODO: should do the return at the bottom, not inside each case...(see metaReducer...)
function gameboardReducer(state = initialGameboardEmpty, { type, payload }) {
	let stateDeepCopy = JSON.parse(JSON.stringify(state));
	let freshBoard;
	let positions;
	switch (type) {
		case INITIAL_GAMESTATE:
			positions = Object.keys(payload.gameboardPieces);
			for (let x = 0; x < positions.length; x++) {
				stateDeepCopy[positions[x]].pieces = payload.gameboardPieces[positions[x]];
			}
			return stateDeepCopy;
		case NEW_ROUND:
		case PLACE_PHASE:
			if (payload.gameboardPieces) {
				//this would happen on the 1st event (from executeStep)
				freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
				positions = Object.keys(payload.gameboardPieces);
				for (let x = 0; x < positions.length; x++) {
					freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
				}
				return freshBoard;
			} else {
				return stateDeepCopy; //TODO: return at the bottom instead? (be consistent)
			}
		case PIECES_MOVE:
			//TODO: consolidate this with initial gamestate (or change)
			freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
			positions = Object.keys(payload.gameboardPieces);
			for (let x = 0; x < positions.length; x++) {
				freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
			}
			return freshBoard;
		case SLICE_CHANGE:
			for (let x = 0; x < payload.confirmedRods.length; x++) {
				stateDeepCopy[payload.confirmedRods[x]].pieces = [];
			}
			for (let x = 0; x < payload.confirmedBioWeapons.length; x++) {
				stateDeepCopy[payload.confirmedBioWeapons[x]].pieces = [];
			}
			for (let x = 0; x < payload.confirmedInsurgencyPieces.length; x++) {
				let currentPiece = payload.confirmedInsurgencyPieces[x];
				let { piecePositionId, pieceId } = currentPiece;

				//remove specific piece from the stateDeepCopy
				stateDeepCopy[piecePositionId].pieces = stateDeepCopy[piecePositionId].pieces.filter((piece, index) => {
					return piece.pieceId !== pieceId;
				});
			}
			return stateDeepCopy;
		case NO_MORE_EVENTS:
			if (payload.gameboardPieces) {
				//this would happen on the 1st event (from executeStep)
				freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
				positions = Object.keys(payload.gameboardPieces);
				for (let x = 0; x < positions.length; x++) {
					freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
				}
				return freshBoard;
			} else {
				return stateDeepCopy;
			}
		case REMOTE_SENSING_SELECTED:
			freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
			positions = Object.keys(payload.gameboardPieces);
			for (let x = 0; x < positions.length; x++) {
				freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
			}
			return freshBoard;
		case EVENT_BATTLE:
			//TODO: refactor, done twice? (event_refuel...)
			if (payload.gameboardPieces) {
				//this would happen on the 1st event (from executeStep)
				freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
				positions = Object.keys(payload.gameboardPieces);
				for (let x = 0; x < positions.length; x++) {
					freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
				}
				return freshBoard;
			} else {
				return stateDeepCopy;
			}
		case EVENT_REFUEL:
			if (payload.gameboardPieces) {
				//this would happen on the 1st event (from executeStep)
				freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
				positions = Object.keys(payload.gameboardPieces);
				for (let x = 0; x < positions.length; x++) {
					freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
				}
				return freshBoard;
			} else {
				return stateDeepCopy;
			}
		case REFUEL_RESULTS:
			const { fuelUpdates } = payload;

			for (let y = 0; y < fuelUpdates.length; y++) {
				//need to find the piece on the board and update it, would be nice if we had the position...
				let thisFuelUpdate = fuelUpdates[y];
				let { pieceId, piecePositionId, newFuel } = thisFuelUpdate;
				for (let x = 0; x < stateDeepCopy[piecePositionId].pieces.length; x++) {
					if (stateDeepCopy[piecePositionId].pieces[x].pieceId === pieceId) {
						stateDeepCopy[piecePositionId].pieces[x].pieceFuel = newFuel;
						break;
					}
				}
			}

			return stateDeepCopy;
		case PIECE_PLACE:
			stateDeepCopy[payload.positionId].pieces.push(payload.newPiece);
			return stateDeepCopy;
		case CLEAR_BATTLE:
			//remove pieces from the masterRecord that won?
			const { masterRecord, friendlyPieces, enemyPieces } = payload.battle;

			for (let x = 0; x < masterRecord.length; x++) {
				let currentRecord = masterRecord[x];
				let { targetId, win } = currentRecord;
				if (targetId && win) {
					//need to remove the piece from the board...
					let potentialPieceToRemove1 = friendlyPieces.find(battlePiece => {
						return battlePiece.piece.pieceId === targetId;
					});
					let potentialPieceToRemove2 = enemyPieces.find(battlePiece => {
						return battlePiece.piece.pieceId === targetId;
					});

					//don't know if was enemy or friendly (wasn't in the masterRecord (could change this to be more efficient...))
					let battlePieceToRemove = potentialPieceToRemove1 || potentialPieceToRemove2;
					let { pieceId, piecePositionId } = battlePieceToRemove.piece;

					stateDeepCopy[piecePositionId].pieces = stateDeepCopy[piecePositionId].pieces.filter(piece => {
						return piece.pieceId !== pieceId;
					});
				}
			}

			return stateDeepCopy;
		default:
			return stateDeepCopy;
	}
}

export default gameboardReducer;

// let gameboard = [
// 	0: {
// 		type: "land",
// 		pieces: []
// 	},
// 	1: {
// 		type: "water",
// 		pieces: []
// 	}
// ]
