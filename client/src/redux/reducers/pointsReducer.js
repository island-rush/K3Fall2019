import { INITIAL_GAMESTATE, MANUAL_POINTS } from "../actions/types";

export default function pointsReducer(state = -1, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.points;
		case MANUAL_POINTS:
			return payload;
		default:
			return state;
	}
}
