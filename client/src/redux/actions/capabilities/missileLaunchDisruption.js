import setUserfeedbackAction from "../setUserfeedbackAction";

const missileLaunchDisruption = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("missileLaunchDisruption"));
    };
};

export default missileLaunchDisruption;
