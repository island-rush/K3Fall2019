import {
    INITIAL_GAMESTATE,
    SHOP_TRANSFER,
    PIECE_PLACE,
    RODS_FROM_GOD_SELECTED,
    REMOTE_SENSING_SELECTED,
    INSURGENCY_SELECTED,
    BIO_WEAPON_SELECTED,
    RAISE_MORALE_SELECTED,
    COMM_INTERRUP_SELECTED,
    GOLDEN_EYE_SELECTED
} from "../actions/actionTypes";

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
        //These methods are all removing the capability from the inventory
        case RODS_FROM_GOD_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case INSURGENCY_SELECTED:
        case BIO_WEAPON_SELECTED:
        case RAISE_MORALE_SELECTED:
        case GOLDEN_EYE_SELECTED:
        case COMM_INTERRUP_SELECTED:
            return state.filter(invItem => {
                return invItem.invItemId !== payload.invItem.invItemId;
            });
        default:
            return state;
    }
}

export default invReducer;
