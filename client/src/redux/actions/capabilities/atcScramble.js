import setUserfeedbackAction from "../setUserfeedbackAction";

const atcScramble = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("atcScramble"));
    };
};

export default atcScramble;
