import setUserfeedbackAction from "../setUserfeedbackAction";
import { START_PLAN } from "../actionTypes";

const startPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		//TODO: other checks for if planning is okay, "disable" the button if no piece selected as well
		if (gameboardMeta.selectedPiece !== -1) {
			if (gameboardMeta.planning.active) {
				dispatch(setUserfeedbackAction("Already planning a move..."));
			} else {
				dispatch({ type: START_PLAN });
			}
		} else {
			dispatch(setUserfeedbackAction("Must select a piece to plan a move..."));
		}
	};
};

export default startPlan;
