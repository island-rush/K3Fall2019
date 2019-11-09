import { REFUELPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

const refuelPopupMinimizeToggle = () => {
	return (dispatch, getState, emit) => {
		dispatch({
			type: REFUELPOPUP_MINIMIZE_TOGGLE,
			payload: {}
		});
	};
};

export default refuelPopupMinimizeToggle;