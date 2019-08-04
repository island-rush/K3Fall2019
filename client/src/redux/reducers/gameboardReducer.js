import { INITIAL_GAMESTATE } from "../actions/types";

const initialGameboardEmpty = {};

function gameboardReducer(state = initialGameboardEmpty, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameboard;
		default:
			return state;
	}
}

export default gameboardReducer;

// let gameboard = {
// 	0: {
// 		type: "land",
// 		pieces: []
// 	},
// 	1: {
// 		type: "land",
// 		pieces: []
// 	}
// }
