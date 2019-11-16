import setUserfeedbackAction from "../setUserfeedbackAction";

const droneSwarms = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("droneSwarms"));
    };
};

export default droneSwarms;
