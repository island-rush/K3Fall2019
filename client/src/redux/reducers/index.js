import { combineReducers } from "redux";
import pointsReducer from "./pointsReducer";
import userFeedbackReducer from "./userFeedbackReducer";

export default combineReducers({
	points: pointsReducer,
	userFeedback: userFeedbackReducer
});
