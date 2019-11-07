import { distanceMatrix } from "../../gameData/distanceMatrix";
import { TYPE_MOVES } from "../../gameData/gameConstants";
import { POSITION_SELECT, PLANNING_SELECT, HIGHLIGHT_POSITIONS } from "./actionTypes";
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

		//figure out if planning (constrain what to select)
		if (gameboardMeta.planning.active) {
			//TODO: need to be adjacent, can't be -1?
			if (selectedPositionId === -1) {
				dispatch(setUserFeedbackAction("Must select a position for the plan..."));
				return;
			}

			var trueMoveCount = 0;
			for(var i = 0; i < gameboardMeta.planning.moves.length; i++){
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
		} else {
			//select anything
			dispatch({
				type: POSITION_SELECT,
				payload: {
					selectedPositionId
				}
			});
		}
	};
};

export default selectPosition;
