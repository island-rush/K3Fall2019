import { INITIAL_GAMESTATE, SHOP_TRANSFER, PIECE_PLACE } from "../actions/types";

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
		default:
			return state;
	}
}

export default invReducer;

// let inv = [
//     {
//         //invItemId,
//         //invItemGameId,
//         //invItemTeamId,
//         //invItemTypeId,
//     },
//     {
//         //invItemId,
//         //invItemGameId,
//         //invItemTeamId,
//         //invItemTypeId,
//     }
// ]
