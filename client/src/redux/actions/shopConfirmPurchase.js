import { CLIENT_SENDING_ACTION } from "../socketEmits";

const shopConfirmPurchase = () => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: "shopConfirmPurchase",
			payload: {}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default shopConfirmPurchase;
