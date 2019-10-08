import { CLIENT_SENDING_ACTION } from "../socketEmits";

const mainButtonClick = () => {
	return (dispatch, getState, emit) => {
		//check the local state before sending to the server
		const clientAction = {
			type: "mainButtonClick",
			payload: {}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default mainButtonClick;
