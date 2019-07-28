import { INITIAL_GAMESTATE, SET_USERFEEDBACK } from "../actions/types";

const initialUserFeedback = "Loading...";

function userFeedbackReducer(state = initialUserFeedback, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.userFeedback;
		case SET_USERFEEDBACK:
			return payload;
		default:
			return state;
	}
}

export default userFeedbackReducer;
