import {
	INITIAL_GAMESTATE,
	SET_USERFEEDBACK,
	SHOP_REFUND,
	SHOP_PURCHASE
} from "../actions/types";

const initialUserFeedback = "Loading...";

function userFeedbackReducer(state = initialUserFeedback, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.userFeedback;
		case SET_USERFEEDBACK:
			return payload.userFeedback;
		case SHOP_REFUND:
			return "Refunded the purchase!";
		case SHOP_PURCHASE:
			return "Purchased the item!";
		default:
			return state;
	}
}

export default userFeedbackReducer;
