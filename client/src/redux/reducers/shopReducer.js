import { SHOP_PURCHASE, SHOP_REFUND, SHOP_CLEAR, SHOP_TRANSFER, INITIAL_GAMESTATE } from "../actions/actionTypes";

const initialShopState = [];

function shopReducer(state = initialShopState, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			state = payload.shopItems;
			break;
		case SHOP_PURCHASE:
			state = state.concat([payload.shopItem]); //need to append the payload to the state
			break;
		case SHOP_CLEAR:
			state = [];
			break;
		case SHOP_REFUND:
			state = state.filter(function(shopItem, index, arr) {
				return shopItem.shopItemId !== payload.shopItemId;
			});
			break;
		case SHOP_TRANSFER:
			state = [];
			break;
		default:
		//don't change anything...
	}

	return state;
}

export default shopReducer;
