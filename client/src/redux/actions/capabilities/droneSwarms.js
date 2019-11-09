import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const droneSwarms = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("droneSwarms"));
	};
};

export default droneSwarms;
