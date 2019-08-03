import { INITIAL_GAMESTATE } from "../actions/types";

const initialGameboard = [];

function gameboardReducer(state = initialGameboard, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameboard;
		default:
			return state;
	}
}

export default gameboardReducer;
