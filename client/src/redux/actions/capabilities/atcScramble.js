import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const atcScramble = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("atcScramble"));
	};
};

export default atcScramble;
