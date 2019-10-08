import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const shopPurchaseRequest = shopItemTypeId => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: "shopPurchaseRequest",
			payload: {
				shopItemTypeId
			}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default shopPurchaseRequest;
