import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const antiSatelliteMissiles = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("antiSatelliteMissiles"));
	};
};

export default antiSatelliteMissiles;
