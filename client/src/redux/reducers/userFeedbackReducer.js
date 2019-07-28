import { INITIAL_GAMESTATE } from "../actions/types";

const initialUserFeedback = "Welcome to Island Rush!";

function userFeedbackReducer(state = initialUserFeedback, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.userFeedback;
		default:
			return state;
	}
}

export default userFeedbackReducer;
