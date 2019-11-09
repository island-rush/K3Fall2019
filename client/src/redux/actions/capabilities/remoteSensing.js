import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const remoteSensing = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("remoteSensing"));
	};
};

export default remoteSensing;
