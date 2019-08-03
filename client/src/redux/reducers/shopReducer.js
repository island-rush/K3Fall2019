import {
	SHOP_PURCHASE,
	SHOP_REFUND,
	SHOP_CLEAR,
	SHOP_TRANSFER,
	INITIAL_GAMESTATE
} from "../actions/types";

const initialShopState = [];

function shopReducer(state = initialShopState, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.shopItems;
		case SHOP_PURCHASE:
			return state.concat([payload.shopItem]); //need to append the payload to the state
		case SHOP_CLEAR:
			return [];
		case SHOP_REFUND:
			return state.filter(function(shopItem, index, arr) {
				return shopItem.shopItemId !== payload.shopItem.shopItemId;
			});
		case SHOP_TRANSFER:
			return [];
		default:
			return state;
	}
}

export default shopReducer;

// let shop = [
//     {
//         //shopItemId,
//         //shopItemGameId,
//         //shopItemTeamId,
//         //shopItemTypeId,
//     },
//     {
//         //shopItemId,
//         //shopItemGameId,
//         //shopItemTeamId,
//         //shopItemTypeId,
//     }
// ]
