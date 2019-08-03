import { INITIAL_GAMESTATE, SHOP_TRANSFER } from "../actions/types";

const initialInvState = [];

function invReducer(state = initialInvState, { type, payload }) {
	switch (type) {
		case INITIAL_GAMESTATE:
			return payload.invItems;
		case SHOP_TRANSFER:
			return payload.invItems;
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
