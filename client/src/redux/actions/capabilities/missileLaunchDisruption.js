import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const missileLaunchDisruption = invItem => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("missileLaunchDisruption"));
	};
};

export default missileLaunchDisruption;
