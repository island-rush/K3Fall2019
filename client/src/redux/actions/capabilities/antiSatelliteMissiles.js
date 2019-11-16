import setUserfeedbackAction from "../setUserfeedbackAction";

const antiSatelliteMissiles = invItem => {
    return (dispatch, getState, emit) => {
        dispatch(setUserfeedbackAction("antiSatelliteMissiles"));
    };
};

export default antiSatelliteMissiles;
