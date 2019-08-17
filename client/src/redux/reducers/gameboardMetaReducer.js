import {
	POSITION_SELECT,
	PIECE_CLICK,
	PIECE_CLEAR_SELECTION,
	START_PLAN,
	CANCEL_PLAN,
	PLANNING_SELECT,
	PLAN_WAS_CONFIRMED,
	DELETE_PLAN,
	UNDO_MOVE,
	CONTAINER_MOVE,
	INITIAL_GAMESTATE
} from "../actions/types";

const initialGameboardMeta = {
	//TODO: change to selectedPositionId and selectedPieceId to better represent the values
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
	},
	confirmedPlans: {}
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
		case START_PLAN:
			stateDeepCopy.planning.active = true;
			return stateDeepCopy;
		case CANCEL_PLAN:
			stateDeepCopy.planning.active = false;
			stateDeepCopy.planning.moves = [];
			stateDeepCopy.selectedPiece = -1;
			return stateDeepCopy;
		case UNDO_MOVE:
			stateDeepCopy.planning.moves.pop();
			return stateDeepCopy;
		case CONTAINER_MOVE:
			stateDeepCopy.planning.moves.push({
				type: "container",
				positionId: payload.selectedPositionId
			});
			return stateDeepCopy;
		case PLANNING_SELECT:
			//TODO: move this to userActions to have more checks there within the thunk
			stateDeepCopy.planning.moves.push({
				type: "move",
				positionId: payload.selectedPositionId
			});
			return stateDeepCopy;
		case PLAN_WAS_CONFIRMED:
			const { pieceId, plan } = payload;
			stateDeepCopy.confirmedPlans[pieceId] = plan;
			stateDeepCopy.planning.active = false;
			stateDeepCopy.planning.moves = [];
			stateDeepCopy.selectedPiece = -1;
			return stateDeepCopy;
		case DELETE_PLAN:
			delete stateDeepCopy.confirmedPlans[payload.pieceId];
			stateDeepCopy.selectedPiece = -1;
			return stateDeepCopy;
		case INITIAL_GAMESTATE:
			stateDeepCopy.confirmedPlans = payload.confirmedPlans;
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
// 			type: "container", //not sure yet if this is eventual implementation
// 			positionId: 2
// 		},
// 		{
// 			type: "move",
// 			positionId: 3
// 		}
// 	]
// };

// const confirmedPlans = {
// 	0: [
// 		{
// 			type: "move",
// 			positionId: 1
// 		},
// 		{
// 			type: "move",
// 			positionId: 2
// 		}
// 	]
// }
