import {
	INITIAL_GAMESTATE,
	POSITION_SELECT,
	PIECE_CLICK
} from "../actions/types";

const initialGameboardMeta = {
	selectedPosition: -1,
	selectedPiece: -1
};

function gameboardMetaReducer(state = initialGameboardMeta, { type, payload }) {
	let stateDeepCopy = JSON.parse(JSON.stringify(state));
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.gameboardMeta;
		case POSITION_SELECT:
			stateDeepCopy.selectedPosition = payload.positionId;
			return stateDeepCopy;
		case PIECE_CLICK:
			stateDeepCopy.selectedPiece = payload.selectedPieceId;
			return stateDeepCopy;
		default:
			return state;
	}
}

export default gameboardMetaReducer;
