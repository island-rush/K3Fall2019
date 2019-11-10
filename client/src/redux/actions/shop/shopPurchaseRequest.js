import { CLIENT_SENDING_ACTION } from "../../socketEmits";
import { SERVER_SHOP_PURCHASE_REQUEST } from "../actionTypes";

const shopPurchaseRequest = shopItemTypeId => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: SERVER_SHOP_PURCHASE_REQUEST,
			payload: {
				shopItemTypeId
			}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default shopPurchaseRequest;
