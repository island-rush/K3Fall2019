import { CANCEL_PLAN } from "./actionTypes";
import setUserfeedbackAction from "./setUserfeedbackAction";

const cancelPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (gameboardMeta.planning.active) {
			dispatch({ type: CANCEL_PLAN });
		} else {
			//check to see if there is a piece selected and if that piece has a confirmed plan
			if (gameboardMeta.selectedPiece !== -1 && gameboardMeta.selectedPiece in gameboardMeta.confirmedPlans) {
				//delete the plans from the database request
				const clientAction = {
					type: "deletePlan",
					payload: {
						pieceId: gameboardMeta.selectedPiece
					}
				};
				emit("clientSendingAction", clientAction);
			} else {
				dispatch(setUserfeedbackAction("Must select a piece to delete + already have a plan for it to cancel/delete"));
			}
		}
	};
};

export default cancelPlan;
