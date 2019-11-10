import { INITIAL_GAMESTATE, SHOP_TRANSFER, PIECE_PLACE, RODS_FROM_GOD_SELECTED, REMOTE_SENSING_SELECTED, INSURGENCY_SELECTED, BIO_WEAPON_SELECTED } from "../actions/actionTypes";

const initialInvState = [];

function invReducer(state = initialInvState, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.invItems;
		case SHOP_TRANSFER:
			return payload.invItems;
		case PIECE_PLACE:
			return state.filter(invItem => {
				return invItem.invItemId !== payload.invItemId;
			});
		//TOOD: could combine these methods
		case RODS_FROM_GOD_SELECTED:
			return state.filter(invItem => {
				return invItem.invItemId !== payload.invItem.invItemId;
			});
		case REMOTE_SENSING_SELECTED:
			return state.filter(invItem => {
				return invItem.invItemId !== payload.invItem.invItemId;
			});
		case INSURGENCY_SELECTED:
			return state.filter(invItem => {
				return invItem.invItemId !== payload.invItem.invItemId;
			});
		case BIO_WEAPON_SELECTED:
			return state.filter(invItem => {
				return invItem.invItemId !== payload.invItem.invItemId;
			});
		default:
			return state;
	}
}

export default invReducer;
