import { INITIAL_GAMESTATE } from "../actions/types";

const initialGameInfoState = {
	gameSection: "Loading...",
	gameInstructor: "Loading...",
	gameController: "Loading..."
};

function gameInfoReducer(state = initialGameInfoState, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameInfo;
		default:
			return state;
	}
}

export default gameInfoReducer;
