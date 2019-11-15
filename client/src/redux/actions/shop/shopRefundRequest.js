import { SOCKET_CLIENT_SENDING_ACTION } from "../../../gameData/otherConstants";
import { SERVER_SHOP_REFUND_REQUEST } from "../actionTypes";

const shopRefundRequest = shopItem => {
    return (dispatch, getState, emit) => {
        const clientAction = {
            type: SERVER_SHOP_REFUND_REQUEST,
            payload: {
                shopItem
            }
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default shopRefundRequest;
