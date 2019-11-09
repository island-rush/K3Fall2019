import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const missileLaunchDisruption = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("missileLaunchDisruption"));
	};
};

export default missileLaunchDisruption;
