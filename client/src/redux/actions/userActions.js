import {
	MENU_SELECT,
	POSITION_SELECT,
	PIECE_CLICK,
	PIECE_CLEAR_SELECTION,
	START_PLANNING,
	SET_USERFEEDBACK
} from "./types";

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
	return (dispatch, getState, emit) => {
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

export const selectPiece = selectedPiece => {
	return {
		type: PIECE_CLICK,
		payload: {
			selectedPieceId: selectedPiece.pieceId
		}
	};
};

export const startPlanning = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		//TODO: other checks for if planning is okay, "disable" the button if no piece selected as well
		if (gameboardMeta.selectedPiece !== -1) {
			dispatch({ type: START_PLANNING });
		} else {
			dispatch({
				type: SET_USERFEEDBACK,
				payload: { userFeedback: "Must select a piece to begin planning" }
			});
		}
	};
};

export const clearPieceSelection = () => {
	return {
		type: PIECE_CLEAR_SELECTION,
		payload: {
			selectedPieceId: -1
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
