import setUserfeedbackAction from "../setUserfeedbackAction";
import { UNDO_MOVE } from "../actionTypes";

const undoMove = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (gameboardMeta.planning.active) {
			dispatch({
				type: UNDO_MOVE
			});
		} else {
			dispatch(setUserfeedbackAction("Can only undo while actively planning"));
		}
	};
};

export default undoMove;
