import {
	POSITION_SELECT,
	PIECE_CLICK,
	PIECE_CLEAR_SELECTION,
	START_PLANNING,
	CANCEL_PLANNING,
	UNDO_PLANNING
} from "../actions/types";

const initialGameboardMeta = {
	selectedPosition: -1,
	selectedPiece: -1,
	newsAlert: {
		active: false,
		title: "Loading Title...",
		info: "Loading Info..."
	},
	battle: {
		active: false
	},
	planning: {
		active: false,
		moves: []
	}
};

function gameboardMetaReducer(state = initialGameboardMeta, { type, payload }) {
	let stateDeepCopy = JSON.parse(JSON.stringify(state));
	switch (type) {
		case POSITION_SELECT:
			stateDeepCopy.selectedPosition = parseInt(payload.selectedPositionId);
			return stateDeepCopy;
		case PIECE_CLICK:
			stateDeepCopy.selectedPiece = parseInt(payload.selectedPieceId);
			return stateDeepCopy;
		case PIECE_CLEAR_SELECTION:
			stateDeepCopy.selectedPiece = -1;
			return stateDeepCopy;
		case START_PLANNING:
			stateDeepCopy.planning.active = true;
			return stateDeepCopy;
		case CANCEL_PLANNING:
			stateDeepCopy.planning.active = false;
			stateDeepCopy.planning.moves = [];
			stateDeepCopy.selectedPiece = -1;
			return stateDeepCopy;
		case UNDO_PLANNING:
			stateDeepCopy.planning.moves.pop();
			return stateDeepCopy;
		default:
			return state;
	}
}

export default gameboardMetaReducer;

// const planning = {
// 	active: true,
// 	//from position 0
// 	moves: [
// 		{
// 			type: "move",
// 			positionId: 1
// 		},
// 		{
// 			type: "move",
// 			positionId: 2
// 		},
// 		{
// 			type: "container",  //not sure yet if this is eventual implementation
// 			positionId: 2
// 		},
// 		{
// 			type: "move",
// 			positionId: 3
// 		}
// 	]
// }
