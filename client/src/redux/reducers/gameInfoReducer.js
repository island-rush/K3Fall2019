import {
	INITIAL_GAMESTATE,
	SHOP_PURCHASE,
	SHOP_REFUND
} from "../actions/types";

const initialGameInfoState = {
	gameSection: "Loading...",
	gameInstructor: "Loading...",
	gameController: "Loading...",
	gamePoints: -1
};

function gameInfoReducer(state = initialGameInfoState, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameInfo;
		case SHOP_PURCHASE:
			state.gamePoints = payload.points;
			return state;
		case SHOP_REFUND:
			state.gamePoints += payload.pointsAdded;
			return state;
		default:
			return state;
	}
}

export default gameInfoReducer;
