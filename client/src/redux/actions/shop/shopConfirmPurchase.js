import { CLIENT_SENDING_ACTION } from "../../socketEmits";
import { SERVER_SHOP_CONFIRM_PURCHASE } from "../actionTypes";

const shopConfirmPurchase = () => {
	return (dispatch, getState, emit) => {
		const clientAction = {
			type: SERVER_SHOP_CONFIRM_PURCHASE,
			payload: {}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default shopConfirmPurchase;
