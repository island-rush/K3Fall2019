import {
	MENU_SELECT,
	POSITION_SELECT,
	PIECE_CLICK,
	PIECE_CLEAR_SELECTION,
	START_PLANNING,
	SET_USERFEEDBACK,
	CANCEL_PLANNING,
	UNDO_PLANNING,
	OPEN_CONTAINER_PLANNING,
	CONFIRM_PLANNING,
	PLANNING_SELECT
} from "./types";

import { distanceMatrix } from "./distanceMatrix";

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
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		//figure out if planning (constrain what to select)
		if (gameboardMeta.planning.active) {
			//TODO: need to be adjacent, can't be -1?
			if (selectedPositionId !== -1) {
				//from the selected position or the last move in the plan?

				const lastSelectedPosition =
					gameboardMeta.planning.moves.length > 0
						? gameboardMeta.planning.moves[
								gameboardMeta.planning.moves.length - 1
						  ].positionId
						: gameboardMeta.selectedPosition;

				if (distanceMatrix[lastSelectedPosition][selectedPositionId] === 1) {
					dispatch({
						type: PLANNING_SELECT,
						payload: {
							selectedPositionId
						}
					});
				} else {
					dispatch(setUserFeedback("Must select adjacent position..."));
				}
			} else {
				dispatch(setUserFeedback("Must select a position for the plan..."));
			}
		} else {
			//select anything
			dispatch({
				type: POSITION_SELECT,
				payload: {
					selectedPositionId
				}
			});
		}
	};
};

export const selectPiece = selectedPiece => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (!gameboardMeta.planning.active) {
			dispatch({
				type: PIECE_CLICK,
				payload: {
					selectedPieceId: selectedPiece.pieceId
				}
			});
		}
	};
};

const setUserFeedback = userFeedback => {
	return {
		type: SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
};

export const confirmPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		//check to see if moves array is empty?
		const payload = {
			pieceId: gameboardMeta.selectedPiece,
			plan: gameboardMeta.planning.moves
		};

		emit("confirmPlan", payload);
	};
};

export const startPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		//TODO: other checks for if planning is okay, "disable" the button if no piece selected as well
		if (gameboardMeta.selectedPiece !== -1) {
			if (gameboardMeta.planning.active) {
				dispatch(setUserFeedback("Already planning a move..."));
			} else {
				dispatch({ type: START_PLANNING });
			}
		} else {
			dispatch(setUserFeedback("Must select a piece to plan a move..."));
		}
	};
};

export const cancelPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (gameboardMeta.planning.active) {
			dispatch({ type: CANCEL_PLANNING });
		} else {
			//check to see if there is a piece selected and if that piece has a confirmed plan
			if (
				gameboardMeta.selectedPiece !== -1 &&
				gameboardMeta.selectedPiece in gameboardMeta.confirmedPlans
			) {
				//delete the plans from the database request
				const payload = {
					pieceId: gameboardMeta.selectedPiece
				};
				emit("deletePlan", payload);
			} else {
				dispatch(
					setUserFeedback(
						"Must select a piece to delete + already have a plan for it to cancel/delete"
					)
				);
			}
		}
	};
};

// export const confirmPlanning = () => {
// 	return (dispatch, getState, emit) => {
// 		//get the plans from the state and emit them to the server probably
// 	};
// };

// export const undoMove = () => {
// 	return {
// 		type: UNDO_PLANNING
// 	};
// };

export const openContainerPlanning = () => {
	return (dispatch, getState, emit) => {
		//whatever this function eventually becomes...
	};
};

export const clearPieceSelection = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (!gameboardMeta.planning.active) {
			dispatch({
				type: PIECE_CLEAR_SELECTION
			});
		}
	};
};

export const menuSelect = selectedMenuId => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (!gameboardMeta.planning.active) {
			dispatch({
				type: MENU_SELECT,
				payload: {
					selectedMenuId
				}
			});
		}
	};
};
