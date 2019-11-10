import { distanceMatrix } from "../../gameData/distanceMatrix";
import { TYPE_MOVES, TYPE_NAME_IDS, REMOTE_SENSING_RANGE } from "../../gameData/gameConstants";
import { POSITION_SELECT, PLANNING_SELECT, HIGHLIGHT_POSITIONS } from "./actionTypes";
import { CLIENT_SENDING_ACTION } from "../socketEmits";
import setUserFeedbackAction from "./setUserfeedbackAction";

const selectPosition = selectedPositionId => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (!gameboardMeta.planning.active) {
			//select anything and highlight, looking at the position
			dispatch({
				type: POSITION_SELECT,
				payload: {
					selectedPositionId
				}
			});
			return;
		}

		//is actively planning
		if (selectedPositionId === -1 && !gameboardMeta.planning.capability) {
			dispatch(setUserFeedbackAction("Must select a position for the plan..."));
			return;
		}

		//Currently for 'rods from god' but will likely be used for other capabilities (non-piece selections on the board (with planning))
		if (gameboardMeta.planning.capability) {
			//highlight if needed
			if (gameboardMeta.planning.invItem.invItemTypeId === TYPE_NAME_IDS["Remote Sensing"]) {
				let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
				let highlightedPositions = [];
				for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
					if (distanceMatrix[clickedPosition][x] <= REMOTE_SENSING_RANGE) highlightedPositions.push(x);
				}

				dispatch({
					type: HIGHLIGHT_POSITIONS,
					payload: {
						highlightedPositions
					}
				});
			}

			// eslint-disable-next-line no-restricted-globals
			if (confirm("Are you sure you want to use capability on this position?")) {
				let type;
				switch (gameboardMeta.planning.invItem.invItemTypeId) {
					case TYPE_NAME_IDS["Rods from God"]:
						type = "rodsFromGodConfirm";
						break;
					case TYPE_NAME_IDS["Remote Sensing"]:
						type = "remoteSensingConfirm";
						break;
					case TYPE_NAME_IDS["Insurgency"]:
						type = "insurgencyConfirm";
						break;
					default:
						dispatch(setUserFeedbackAction("unkown/not yet implemented invItemTypeId functionality (capability)"));
						return;
				}

				//TODO: frontend action to change into a 'waiting on server' state?
				dispatch({
					type: HIGHLIGHT_POSITIONS,
					payload: {
						highlightedPositions: []
					}
				});

				const clientAction = {
					type,
					payload: {
						selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition,
						invItem: gameboardMeta.planning.invItem
					}
				};

				emit(CLIENT_SENDING_ACTION, clientAction);
				return;
			}

			//select the position anyway
			dispatch({
				type: POSITION_SELECT,
				payload: {
					selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition
				}
			});
			return;
		}

		var trueMoveCount = 0;
		for (var i = 0; i < gameboardMeta.planning.moves.length; i++) {
			const { type } = gameboardMeta.planning.moves[i];
			if (type === "move") {
				trueMoveCount++;
			}
		}

		if (trueMoveCount > TYPE_MOVES[gameboardMeta.selectedPiece.pieceTypeId] - 1) {
			dispatch(setUserFeedbackAction("Must move piece within range..."));
			return;
		}

		//from the selected position or the last move in the plan?
		const lastSelectedPosition =
			gameboardMeta.planning.moves.length > 0 ? gameboardMeta.planning.moves[gameboardMeta.planning.moves.length - 1].positionId : gameboardMeta.selectedPosition;

		if (distanceMatrix[lastSelectedPosition][selectedPositionId] !== 1) {
			dispatch(setUserFeedbackAction("Must select adjacent position..."));
			return;
		}

		dispatch({
			type: PLANNING_SELECT,
			payload: {
				selectedPositionId
			}
		});
	};
};

export default selectPosition;
