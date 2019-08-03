import { combineReducers } from "redux";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";
import sideMenuReducer from "./sideMenuReducer";
import shopReducer from "./shopReducer";
import invReducer from "./invReducer";
import gameboardReducer from "./gameboardReducer";
import gameboardMetaReducer from "./gameboardMetaReducer";

const rootReducer = combineReducers({
	userFeedback: userFeedbackReducer,
	gameInfo: gameInfoReducer,
	menuSelected: sideMenuReducer,
	shopItems: shopReducer,
	invItems: invReducer,
	gameboard: gameboardReducer,
	gameboardMeta: gameboardMetaReducer
});

export default rootReducer;
