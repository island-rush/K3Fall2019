import { BATTLEPOPUP_MINIMIZE } from "./actionTypes";

const battlePopupMinimize = () => {
    return (dispatch, getState, emit) => {
        dispatch({
            type: BATTLEPOPUP_MINIMIZE,
            payload: {}
        });
	};
};

export default battlePopupMinimize;