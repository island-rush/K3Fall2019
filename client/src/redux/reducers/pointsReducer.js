export default function pointsReducer(state = -1, { type, payload }) {
	switch (type) {
		case "MANUAL_POINTS":
			return payload;
		default:
			return state;
	}
}
