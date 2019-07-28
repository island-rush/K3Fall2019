import { combineReducers } from "redux";
import pointsReducer from "./pointsReducer";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";

const rootReducer = combineReducers({
	points: pointsReducer,
	userFeedback: userFeedbackReducer,
	gameInfo: gameInfoReducer
});

export default rootReducer;
