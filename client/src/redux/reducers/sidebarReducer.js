import { MENU_SELECT } from "../actions/types";

const initialMenuOpenId = 0;

function sidebarReducer(state = initialMenuOpenId, { type, payload }) {
	switch (type) {
		case MENU_SELECT:
			return payload.selectedMenuId !== state ? payload.selectedMenuId : 0;
		default:
			return state;
	}
}

export default sidebarReducer;
