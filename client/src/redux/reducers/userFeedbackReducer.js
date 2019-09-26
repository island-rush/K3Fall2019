import {
	INITIAL_GAMESTATE,
	SET_USERFEEDBACK,
	SHOP_REFUND,
	SHOP_PURCHASE,
	SHOP_TRANSFER,
	START_PLAN,
	CANCEL_PLAN,
	DELETE_PLAN,
	PLAN_WAS_CONFIRMED,
	MAIN_BUTTON_CLICK,
	PURCHASE_PHASE,
	COMBAT_PHASE,
	SLICE_CHANGE,
	NEWS_PHASE,
	NEW_ROUND,
	PLACE_PHASE,
	PIECES_MOVE,
	BATTLE_PIECE_SELECT,
	TARGET_PIECE_SELECT,
	ENEMY_PIECE_SELECT,
	MENU_SELECT
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
		case START_PLAN:
			return "Now Planning: Select positions to create the plan...";
		case CANCEL_PLAN:
			return "Cancelled the plan...";
		case DELETE_PLAN:
			return "Deleted the confirmed plan...";
		case PLAN_WAS_CONFIRMED:
			return "Plan was confirmed!";
		case MAIN_BUTTON_CLICK:
			return "Waiting on the other team...";
		case PURCHASE_PHASE:
			return "Switched to the purchase phase....check out the shop and buy stuff...";
		case COMBAT_PHASE:
			return "Switched to the combat phase...start to plan your turn by clicking on pieces!";
		case SLICE_CHANGE:
			return "Done planning, click main button to execute the plan...";
		case NEWS_PHASE:
			return "Switched to the news phase...";
		case NEW_ROUND:
			return "New Round of Combat!...";
		case PLACE_PHASE:
			return "Place troops onto the board from inventory...";
		case PIECES_MOVE:
			return "Executed a step!";
		case BATTLE_PIECE_SELECT:
			return "Selected Piece to attack with...";
		case TARGET_PIECE_SELECT:
			return "Target piece clicked?";
		case ENEMY_PIECE_SELECT:
			return "Enemy piece clicked?";
		case MENU_SELECT:
			return "selected the menu";
		default:
			return state;
	}
}

export default userFeedbackReducer;
