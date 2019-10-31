import { BATTLEPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

const battlePopupMinimizeToggle = () => {
	return (dispatch, getState, emit) => {
		dispatch({
			type: BATTLEPOPUP_MINIMIZE_TOGGLE,
			payload: {}
		});
	};
};

export default battlePopupMinimizeToggle;
