import setUserfeedbackAction from "../setUserfeedbackAction";
import {} from "../actionTypes";

const aircraftClick = (aircraftPiece, aircraftPieceIndex) => {
	return (dispatch, getState, emit) => {
		dispatch(setUserfeedbackAction("aircraft click"));
		return;
	};
};

export default aircraftClick;
