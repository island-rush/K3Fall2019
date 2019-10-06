import { SET_USERFEEDBACK } from "../../client/src/redux/actions/types";

const sendUserFeedback = async (socket, userFeedback) => {
	const serverAction = {
		type: SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

module.exports = sendUserFeedback;
