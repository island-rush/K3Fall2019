import setUserfeedbackAction from "../setUserfeedbackAction";

const cyberDominance = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("cyberDominance"));
    };
};

export default cyberDominance;
