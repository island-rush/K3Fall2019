import { MENU_SELECT, POSITION_SELECT } from "./types";

export const shopPurchaseRequest = shopItemTypeId => {
	return (dispatch, getState, emit) => {
		emit("shopPurchaseRequest", shopItemTypeId);
	};
};

export const shopRefundRequest = shopItemId => {
	return (dispatch, getState, emit) => {
		emit("shopRefundRequest", shopItemId);
	};
};

export const shopConfirmPurchase = () => {
	return (dispath, getState, emit) => {
		emit("shopConfirmPurchase");
	};
};

export const selectPosition = selectedPositionId => {
	return {
		type: POSITION_SELECT,
		payload: {
			positionId: selectedPositionId
		}
	};
};

export const menuSelect = selectedMenuId => {
	return {
		type: MENU_SELECT,
		payload: {
			selectedMenuId: selectedMenuId
		}
	};
};
