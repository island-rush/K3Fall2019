import { MENU_SELECT } from "./types";

export function clientSendingDataAction(clientData) {
	return (dispatch, getState, emit) => {
		emit("clientSendingData", clientData);
	};
}

export function menuSelect(menuNumber) {
	return {
		type: MENU_SELECT,
		payload: menuNumber
	};
}
