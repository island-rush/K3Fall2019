import setUserfeedbackAction from "../setUserfeedbackAction";

const nuclearStrike = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("nuclearStrike"));
    };
};

export default nuclearStrike;
