import { CONTAINER_MOVE } from "./actionTypes";
import setUserfeedbackAction from "./setUserfeedbackAction";

const containerMove = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (gameboardMeta.planning.active) {
			// get either last position from the planning moves, or selectedPosition from overall if no moves yet made

			// need other checks, such as doing it multiple times in a row prevention...other game rule checks for containers

			const lastSelectedPosition =
				gameboardMeta.planning.moves.length > 0 ? gameboardMeta.planning.moves[gameboardMeta.planning.moves.length - 1].positionId : gameboardMeta.selectedPosition;

			dispatch({
				type: CONTAINER_MOVE,
				payload: {
					selectedPositionId: lastSelectedPosition
				}
			});
		} else {
			dispatch(setUserfeedbackAction("Can only do container moves while actively planning..."));
		}
	};
};

export default containerMove;
