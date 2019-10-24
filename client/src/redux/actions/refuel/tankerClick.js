import setUserfeedbackAction from "../setUserfeedbackAction";
import {} from "../actionTypes";

const tankerClick = (tankerPiece, tankerPieceIndex) => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("tanker click"));
		return;
	};
};

export default tankerClick;
