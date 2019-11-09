import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const seaMines = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("seaMines"));
	};
};

export default seaMines;
