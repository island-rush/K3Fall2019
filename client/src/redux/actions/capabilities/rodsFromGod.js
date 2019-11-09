import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const rodsFromGod = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("rods from god!"));
	};
};

export default rodsFromGod;
