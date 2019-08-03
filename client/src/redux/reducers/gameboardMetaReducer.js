import { INITIAL_GAMESTATE } from "../actions/types";

const initialGameboardMeta = {
	selectedPosition: -1
};

function gameboardMetaReducer(state = initialGameboardMeta, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameboardMeta;
		default:
			return state;
	}
}

export default gameboardMetaReducer;
