import {
	INITIAL_GAMESTATE,
	SET_USERFEEDBACK,
	SHOP_REFUND,
	SHOP_PURCHASE,
	SHOP_TRANSFER,
	START_PLANNING
} from "../actions/types";

const initialUserFeedback = "Loading...";

function userFeedbackReducer(state = initialUserFeedback, { type, payload }) {
	switch (type) {
		case SET_USERFEEDBACK:
			return payload.userFeedback;
		case INITIAL_GAMESTATE:
			return "Welcome to Island Rush!";
		case SHOP_REFUND:
			return "Refunded the purchase!";
		case SHOP_PURCHASE:
			return "Purchased the item!";
		case SHOP_TRANSFER:
			return "Confirmed the purchases...check the inventory!";
		case START_PLANNING:
			return "Now Planning: Select positions to create the plan...";
		default:
			return state;
	}
}

export default userFeedbackReducer;
