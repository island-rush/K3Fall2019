import { INITIAL_GAMESTATE } from "../actions/types";

export default function userFeedbackReducer(state = "", { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.userFeedback;
		default:
			return state;
	}
}
