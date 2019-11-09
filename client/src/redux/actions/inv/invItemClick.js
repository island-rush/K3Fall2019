import setUserfeedbackAction from "../setUserfeedbackAction";
// import { CLIENT_SENDING_ACTION } from "../socketEmits";

const invItemClick = () => {
	return (dispatch, getState, emit) => {
		//check to see if allowed to use this inv item?
		//check locally before sending request...but ultimately still check on the server side

		//TODO: GET RID OF THIS FUNCTION, NOW USING OTHER FUNCTIONS FOR MORE SPECIFIC ACTIONS

		dispatch(setUserfeedbackAction("inv item was clicked...please use better function"));
	};
};

export default invItemClick;
