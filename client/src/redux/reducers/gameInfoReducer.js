import {
	INITIAL_GAMESTATE,
	SHOP_PURCHASE,
	SHOP_REFUND,
	PURCHASE_PHASE,
	MAIN_BUTTON_CLICK,
	COMBAT_PHASE
} from "../actions/types";

const initialGameInfoState = {
	gameSection: "Loading...",
	gameInstructor: "Loading...",
	gameController: "Loading...",
	gamePhase: 0,
	gameStatus: 0,
	gamePoints: -1
};

function gameInfoReducer(state = initialGameInfoState, { type, payload }) {
	//TODO: figure out if deep copy works, or if regular works (stick to a standard...)
	let stateDeepCopy = JSON.parse(JSON.stringify(state));
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameInfo;
		case SHOP_PURCHASE:
			state.gamePoints = payload.points;
			return state;
		case SHOP_REFUND:
			state.gamePoints += payload.pointsAdded;
			return state;
		case PURCHASE_PHASE:
			stateDeepCopy.gamePhase = 1;
			stateDeepCopy.gameStatus = 0;
			return stateDeepCopy;
		case MAIN_BUTTON_CLICK:
			stateDeepCopy.gameStatus = 1;
			return stateDeepCopy;
		case COMBAT_PHASE:
			stateDeepCopy.gameStatus = 0;
			stateDeepCopy.gamePhase = 2;
			return stateDeepCopy;
		default:
			return state;
	}
}

export default gameInfoReducer;
