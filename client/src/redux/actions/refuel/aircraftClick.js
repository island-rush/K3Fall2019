import setUserfeedbackAction from "../setUserfeedbackAction";
import { AIRCRAFT_CLICK } from "../actionTypes";

const aircraftClick = (aircraftPiece, aircraftPieceIndex) => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();
		const { selectedTankerPieceId, aircraft } = gameboardMeta.refuel;

		if (parseInt(selectedTankerPieceId) === -1) {
			dispatch(setUserfeedbackAction("must select tanker to refuel from..."));
			return;
		}

		if (aircraft[aircraftPieceIndex].tankerPieceIndex != null) {
			dispatch(setUserfeedbackAction("already selected..."));
			return;
		}

		//TODO: determine if it has enough fuel to give for this piece...

		dispatch({
			type: AIRCRAFT_CLICK,
			payload: {
				aircraftPiece,
				aircraftPieceIndex
			}
		});
		return;
	};
};

export default aircraftClick;
