import { combineReducers } from "redux";
import pointsReducer from "./pointsReducer";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";

export default combineReducers({
	points: pointsReducer,
	userFeedback: userFeedbackReducer,
	gameInfo: gameInfoReducer
});
