import setUserfeedbackAction from "../setUserfeedbackAction";

const seaMines = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("seaMines"));
    };
};

export default seaMines;
