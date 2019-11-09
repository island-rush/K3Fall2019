import { distanceMatrix } from "../../gameData/distanceMatrix";
import { TYPE_MOVES } from "../../gameData/gameConstants";
import { POSITION_SELECT, PLANNING_SELECT, HIGHLIGHT_POSITIONS } from "./actionTypes";
import { CLIENT_SENDING_ACTION } from "../socketEmits";
import setUserFeedbackAction from "./setUserfeedbackAction";

const selectPosition = selectedPositionId => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		const isHighlightingARange = false;
		if (isHighlightingARange) {
			const range = 1;

			let highlightedPositions = [];
			for (let x = 0; x < distanceMatrix[selectedPositionId].length; x++) {
				if (distanceMatrix[selectedPositionId][x] < range) {
					highlightedPositions.push(x);
				}
			}

			dispatch({
				type: HIGHLIGHT_POSITIONS,
				payload: {
					highlightedPositions
				}
			});
		}

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
			// eslint-disable-next-line no-restricted-globals
			if (confirm("Are you sure you want to use rod's from god on this position?")) {
				const clientAction = {
					type: "rodsFromGodSelect",
					payload: {
						selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition,
						invItem: gameboardMeta.planning.invItem
					}
				};

				emit(CLIENT_SENDING_ACTION, clientAction);
			} else {
				dispatch({
					type: POSITION_SELECT,
					payload: {
						selectedPositionId
					}
				});
			}
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
