import { combineReducers } from "redux";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";
import shopReducer from "./shopReducer";
import invReducer from "./invReducer";
import gameboardReducer from "./gameboardReducer";
import gameboardMetaReducer from "./gameboardMetaReducer";

const rootReducer = combineReducers({
	//TODO: standardize these, along with types, and use same with backend
	userFeedback: userFeedbackReducer,
	gameInfo: gameInfoReducer, //phase / round / status...
	shopItems: shopReducer,
	invItems: invReducer,
	gameboard: gameboardReducer, //pieces on the board
	gameboardMeta: gameboardMetaReducer //popups / selections
});

export default rootReducer;
