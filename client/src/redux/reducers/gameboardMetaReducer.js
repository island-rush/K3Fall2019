import { INITIAL_GAMESTATE, POSITION_SELECT } from "../actions/types";

const initialGameboardMeta = {
	selectedPosition: -1
};

function gameboardMetaReducer(state = initialGameboardMeta, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameboardMeta;
		case POSITION_SELECT:
			return { selectedPosition: parseInt(payload.positionId) };
		default:
			return state;
	}
}

export default gameboardMetaReducer;
