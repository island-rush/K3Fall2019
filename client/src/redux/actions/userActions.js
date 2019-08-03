import { MENU_SELECT } from "./types";

export function shopPurchaseRequest(shopItemTypeId) {
	return (dispatch, getState, emit) => {
		emit("shopPurchaseRequest", shopItemTypeId);
	};
}

export function shopRefundRequest(shopItemId) {
	return (dispatch, getState, emit) => {
		emit("shopRefundRequest", shopItemId);
	};
}

export function menuSelect(menuNumber) {
	return {
		type: MENU_SELECT,
		payload: menuNumber
	};
}
