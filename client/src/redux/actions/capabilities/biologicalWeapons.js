import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const biologicalWeapons = () => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("biologicalWeapons"));
	};
};

export default biologicalWeapons;
