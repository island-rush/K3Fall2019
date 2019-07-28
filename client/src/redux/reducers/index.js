import { combineReducers } from "redux";
import pointsReducer from "./pointsReducer";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";
import sideMenuReducer from "./sideMenuReducer";

const rootReducer = combineReducers({
	points: pointsReducer,
	userFeedback: userFeedbackReducer,
	gameInfo: gameInfoReducer,
	menuSelected: sideMenuReducer
});

export default rootReducer;
