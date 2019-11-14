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
    NEWS_PHASE,
    EVENT_BATTLE,
    NO_MORE_EVENTS,
    UPDATE_FLAGS
} from "../actions/actionTypes";

const initialGameInfoState = {
    gameSection: "Loading...",
    gameInstructor: "Loading...",
    gameController: "Loading...",
    gamePhase: -1,
    gameRound: -1,
    gameSlice: -1,
    gameStatus: -1,
    gamePoints: -1,
    island0: -1,
    island1: -1,
    island2: -1,
    island3: -1,
    island4: -1,
    island5: -1,
    island6: -1,
    island7: -1,
    island8: -1,
    island9: -1,
    island10: -1,
    island11: -1,
    island12: -1
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
        case NO_MORE_EVENTS:
            state.gameStatus = payload.gameStatus;
            return state;
        case SHOP_REFUND:
            state.gamePoints += payload.pointsAdded;
            return state;
        case PURCHASE_PHASE:
            stateDeepCopy.gamePhase = 1;
            stateDeepCopy.gameStatus = 0;
            return stateDeepCopy;
        case UPDATE_FLAGS:
            Object.assign(stateDeepCopy, payload);
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
        case EVENT_BATTLE:
            if (payload.gameStatus !== null) {
                stateDeepCopy.gameStatus = payload.gameStatus;
            }
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
            stateDeepCopy.gamePoints = payload.gamePoints;
            return stateDeepCopy;
        default:
            return state;
    }
}

export default gameInfoReducer;
