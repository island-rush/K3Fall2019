import { NEWSPOPUP_MINIMIZE_TOGGLE } from "./actionTypes"

const newsPopupMinimizeToggle = () => {
    return (dispatch, getState, emit) => {
		dispatch({
			type: NEWSPOPUP_MINIMIZE_TOGGLE,
			payload: {}
		});
	};
};

export default newsPopupMinimizeToggle;