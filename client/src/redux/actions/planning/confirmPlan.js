import setUserfeedbackAction from "../setUserfeedbackAction";
import { CLIENT_SENDING_ACTION } from "../../socketEmits";
import { SERVER_CONFIRM_PLAN } from "../actionTypes";

const confirmPlan = () => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();

		if (gameboardMeta.planning.moves.length === 0) {
			dispatch(setUserfeedbackAction("Can't submit an empty plan..."));
		} else {
			const clientAction = {
				type: SERVER_CONFIRM_PLAN,
				payload: {
					pieceId: gameboardMeta.selectedPiece.pieceId,
					plan: gameboardMeta.planning.moves
				}
			};

			emit(CLIENT_SENDING_ACTION, clientAction);
		}
	};
};

export default confirmPlan;
