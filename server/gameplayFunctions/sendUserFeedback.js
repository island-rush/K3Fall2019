import { SET_USERFEEDBACK } from "../../client/src/redux/actions/actionTypes";
import { SERVER_SENDING_ACTION } from "../../client/src/redux/socketEmits";

const sendUserFeedback = async (socket, userFeedback) => {
	const serverAction = {
		type: SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
	socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = sendUserFeedback;
