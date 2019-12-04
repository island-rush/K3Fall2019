import { combineReducers } from "redux";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";
import shopReducer from "./shopReducer";
import invReducer from "./invReducer";
import gameboardReducer from "./gameboardReducer";
import gameboardMetaReducer from "./gameboardMetaReducer";

const rootReducer = combineReducers({
    //each of these represents a part of the global state
    userFeedback: userFeedbackReducer,
    gameInfo: gameInfoReducer, //phase / round / status...
    shopItems: shopReducer,
    invItems: invReducer,
    gameboard: gameboardReducer, //pieces on the board
    gameboardMeta: gameboardMetaReducer //popups / selections
});

export default rootReducer;
