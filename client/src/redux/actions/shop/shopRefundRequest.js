import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const shopRefundRequest = shopItem => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: "shopRefundRequest",
			payload: {
				shopItem
			}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default shopRefundRequest;
