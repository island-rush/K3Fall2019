import { MENU_SELECT } from "../actions/actionTypes";

const initialMenuOpenId = 0;

//TODO: rename sidebar reducer to selectedMenuReducer or something...
function sidebarReducer(state = initialMenuOpenId, { type, payload }) {
	switch (type) {
		case MENU_SELECT:
			return payload.selectedMenuId !== state ? payload.selectedMenuId : 0;
		default:
			return state;
	}
}

export default sidebarReducer;
