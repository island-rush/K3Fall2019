import { MENU_SELECT } from "../actions/types";

const initialMenuOpen = 0;

function sideMenuReducer(state = initialMenuOpen, { type, payload }) {
	switch (type) {
		case MENU_SELECT:
			return payload !== state ? payload : 0;
		default:
			return state;
	}
}

export default sideMenuReducer;
