import { INITIAL_GAMESTATE, PIECES_MOVE, PIECE_PLACE, CLEAR_BATTLE } from "../actions/types";
import { initialGameboardEmpty } from "./initialGameboardEmpty";

function gameboardReducer(state = initialGameboardEmpty, { type, payload }) {
	let stateDeepCopy = JSON.parse(JSON.stringify(state));
	let positions;
	switch (type) {
		case INITIAL_GAMESTATE:
			positions = Object.keys(payload.gameboardPieces);
			for (let x = 0; x < positions.length; x++) {
				stateDeepCopy[positions[x]].pieces = payload.gameboardPieces[positions[x]];
			}
			return stateDeepCopy;
		case PIECES_MOVE:
			//TODO: consolidate this with initial gamestate (or change)
			let freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
			positions = Object.keys(payload.gameboardPieces);
			for (let x = 0; x < positions.length; x++) {
				freshBoard[positions[x]].pieces = payload.gameboardPieces[positions[x]];
			}
			return freshBoard;
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
