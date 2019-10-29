// import setUserfeedbackAction from "../setUserfeedbackAction";
import { UNDO_FUEL_SELECTION } from "../actionTypes";

const undoFuelSelection = (aircraftPiece, aircraftPieceIndex) => {
	return (dispatch, getState, emit) => {
		// const { gameboardMeta } = getState();
		// const { selectedTankerPieceId } = gameboardMeta.refuel;

		//TODO: determine if it can undo the selection...

		dispatch({
			type: UNDO_FUEL_SELECTION,
			payload: {
				aircraftPiece,
				aircraftPieceIndex
			}
		});
		return;
	};
};

export default undoFuelSelection;
