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
	INITIAL_GAMESTATE,
	SLICE_CHANGE,
	PURCHASE_PHASE,
	NEWS_PHASE,
	BATTLE_PIECE_SELECT,
	ENEMY_PIECE_SELECT,
	TARGET_PIECE_SELECT,
	EVENT_BATTLE,
	NO_MORE_EVENTS
} from "../actions/types";

const initialGameboardMeta = {
	//TODO: change to selectedPositionId and selectedPieceId to better represent the values (ints) (and also selectedBattlePiece -> selectedBattlePieceId)
	selectedPosition: -1,
	selectedPiece: -1,
	news: {
		active: false,
		newsTitle: "Loading Title...",
		newsInfo: "Loading Info..."
	},
	battle: {
		active: false,
		selectedBattlePiece: -1,
		selectedBattlePieceIndex: -1, //helper to find the piece within the array
		masterRecord: null,
		friendlyPieces: [],
		enemyPieces: []
	},
	refuel: {
		active: false
	},
	container: {
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
		case PURCHASE_PHASE:
			stateDeepCopy.news.active = false; //hide the popup
			return stateDeepCopy;
		case NEWS_PHASE:
			stateDeepCopy.news.active = true; //TODO: get the actual news from the database payload
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
			return payload.gameboardMeta;
		case SLICE_CHANGE:
			stateDeepCopy.confirmedPlans = {};
			return stateDeepCopy;
		case BATTLE_PIECE_SELECT:
			//select if different, unselect if was the same
			let lastSelectedBattlePiece = stateDeepCopy.battle.selectedBattlePiece;
			stateDeepCopy.battle.selectedBattlePiece = payload.battlePiece.piece.pieceId === lastSelectedBattlePiece ? -1 : payload.battlePiece.piece.pieceId;
			stateDeepCopy.battle.selectedBattlePieceIndex = payload.battlePiece.piece.pieceId === lastSelectedBattlePiece ? -1 : payload.battlePieceIndex;
			return stateDeepCopy;
		case ENEMY_PIECE_SELECT:
			//need to get the piece that was selected, and put it into the target for the thing
			stateDeepCopy.battle.friendlyPieces[stateDeepCopy.battle.selectedBattlePieceIndex].targetPiece = payload.battlePiece.piece;
			stateDeepCopy.battle.friendlyPieces[stateDeepCopy.battle.selectedBattlePieceIndex].targetPieceIndex = payload.battlePieceIndex;

			return stateDeepCopy;
		case TARGET_PIECE_SELECT:
			//removing the target piece
			stateDeepCopy.battle.friendlyPieces[payload.battlePieceIndex].targetPiece = null;
			stateDeepCopy.battle.friendlyPieces[payload.battlePieceIndex].targetPieceIndex = -1;
			return stateDeepCopy; //TODO: move all return statements to the bottom...
		case EVENT_BATTLE:
			stateDeepCopy.battle = initialGameboardMeta.battle;
			stateDeepCopy.battle.active = true;
			stateDeepCopy.battle.friendlyPieces = payload.friendlyPieces;
			stateDeepCopy.battle.enemyPieces = payload.enemyPieces;
			return stateDeepCopy;
		case NO_MORE_EVENTS:
			stateDeepCopy = initialGameboardMeta; //gets rid of selected position/piece if there was one...
			return stateDeepCopy;
		default:
			return state;
	}
}

export default gameboardMetaReducer;
