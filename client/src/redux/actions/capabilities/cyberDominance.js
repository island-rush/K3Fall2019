import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const cyberDominance = invItem => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("cyberDominance"));
	};
};

export default cyberDominance;
