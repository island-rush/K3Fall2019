import {
	INITIAL_GAMESTATE,
	SHOP_PURCHASE,
	SHOP_REFUND,
	PURCHASE_PHASE,
	MAIN_BUTTON_CLICK,
	COMBAT_PHASE,
	SLICE_CHANGE,
	PLACE_PHASE,
	PIECES_MOVE,
	NEW_ROUND,
	NEWS_PHASE
} from "../actions/types";

const initialGameInfoState = {
	gameSection: "Loading...",
	gameInstructor: "Loading...",
	gameController: "Loading...",
	gamePhase: -1,
	gameRound: -1,
	gameSlice: -1,
	gameStatus: -1,
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
		case SLICE_CHANGE:
			stateDeepCopy.gameStatus = 0;
			stateDeepCopy.gameSlice = 1;
			return stateDeepCopy;
		case PLACE_PHASE:
			stateDeepCopy.gamePhase = 3;
			stateDeepCopy.gameStatus = 0;
			return stateDeepCopy;
		case PIECES_MOVE:
			stateDeepCopy.gameStatus = payload.gameStatus;
			return stateDeepCopy;
		case NEW_ROUND:
			stateDeepCopy.gameRound = payload.gameRound;
			stateDeepCopy.gameStatus = 0;
			stateDeepCopy.gameSlice = 0;
			return stateDeepCopy;
		case NEWS_PHASE:
			stateDeepCopy.gamePhase = 0;
			stateDeepCopy.gameStatus = 0;
			stateDeepCopy.gameRound = 0;
			stateDeepCopy.gameSlice = 0;
			return stateDeepCopy;
		default:
			return state;
	}
}

export default gameInfoReducer;
