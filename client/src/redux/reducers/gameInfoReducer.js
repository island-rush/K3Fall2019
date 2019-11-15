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
import {
    PURCHASE_PHASE_ID,
    NOT_WAITING_STATUS,
    WAITING_STATUS,
    COMBAT_PHASE_ID,
    SLICE_PLANNING_ID,
    SLICE_EXECUTING_ID,
    PLACE_PHASE_ID,
    NEWS_PHASE_ID
} from "../../gameData/gameConstants";

const initialGameInfoState = {
    gameSection: "Loading...",
    gameInstructor: "Loading...",
    gameControllers: [],
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
            stateDeepCopy.gamePhase = PURCHASE_PHASE_ID;
            stateDeepCopy.gameStatus = NOT_WAITING_STATUS;
            return stateDeepCopy;
        case UPDATE_FLAGS:
            Object.assign(stateDeepCopy, payload);
            return stateDeepCopy;
        case MAIN_BUTTON_CLICK:
            stateDeepCopy.gameStatus = WAITING_STATUS;
            return stateDeepCopy;
        case COMBAT_PHASE:
            stateDeepCopy.gameStatus = NOT_WAITING_STATUS;
            stateDeepCopy.gamePhase = COMBAT_PHASE_ID;
            return stateDeepCopy;
        case SLICE_CHANGE:
            stateDeepCopy.gameStatus = NOT_WAITING_STATUS;
            stateDeepCopy.gameSlice = SLICE_EXECUTING_ID;
            return stateDeepCopy;
        case PLACE_PHASE:
            stateDeepCopy.gamePhase = PLACE_PHASE_ID;
            stateDeepCopy.gameStatus = NOT_WAITING_STATUS;
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
            stateDeepCopy.gameStatus = NOT_WAITING_STATUS;
            stateDeepCopy.gameSlice = SLICE_PLANNING_ID;
            return stateDeepCopy;
        case NEWS_PHASE:
            stateDeepCopy.gamePhase = NEWS_PHASE_ID;
            stateDeepCopy.gameStatus = NOT_WAITING_STATUS;
            stateDeepCopy.gameRound = 0;
            stateDeepCopy.gameSlice = SLICE_PLANNING_ID;
            stateDeepCopy.gamePoints = payload.gamePoints;
            return stateDeepCopy;
        default:
            return state;
    }
}

export default gameInfoReducer;
