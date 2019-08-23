import { INITIAL_GAMESTATE, PIECES_MOVE } from "../actions/types";
import { initialGameboardEmpty } from "./initialGameboardEmpty";

function gameboardReducer(state = initialGameboardEmpty, { type, payload }) {
	let stateDeepCopy = JSON.parse(JSON.stringify(state));
	let positions;
	switch (type) {
		case INITIAL_GAMESTATE:
			positions = Object.keys(payload.gameboardPieces);
			for (let x = 0; x < positions.length; x++) {
				stateDeepCopy[positions[x]].pieces =
					payload.gameboardPieces[positions[x]];
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
