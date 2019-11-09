import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const insurgency = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("insurgency"));
	};
};

export default insurgency;
