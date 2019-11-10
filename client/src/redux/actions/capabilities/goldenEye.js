import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const goldenEye = invItem => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("goldenEye"));
	};
};

export default goldenEye;
