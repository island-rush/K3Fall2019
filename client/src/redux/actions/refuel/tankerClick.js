// import setUserfeedbackAction from "../setUserfeedbackAction";
import { TANKER_CLICK } from "../actionTypes";

const tankerClick = (tankerPiece, tankerPieceIndex) => {
	return (dispatch, getState, emit) => {
		//TODO: check for bad state (wrong phase? ...use userFeedback...)

		dispatch({
			type: TANKER_CLICK,
			payload: {
				tankerPiece,
				tankerPieceIndex
			}
		});
		return;
	};
};

export default tankerClick;
