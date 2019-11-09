import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const communicationsInterruption = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("communicationsInterruption"));
	};
};

export default communicationsInterruption;
