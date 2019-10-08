//Helper function, this is used a lot on the frontend, simply returns the 'action'

import { SET_USERFEEDBACK } from "./actionTypes";

const setUserFeedbackAction = userFeedback => {
	return {
		type: SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
};

export default setUserFeedbackAction;
