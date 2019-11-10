// import setUserfeedbackAction from "../setUserfeedbackAction";
import { CLIENT_SENDING_ACTION } from "../../socketEmits";
import { SERVER_CONFIRM_FUEL_SELECTION } from "../actionTypes";

const confirmFuelSelections = () => {
	return (dispatch, getState, emit) => {
		//check the local state before sending to the server
		// const { gameboardMeta } = getState();

		//prevent sending to server if client doesn't have good data, or we know somehow its a bad time to confirm
		//(ex: not actively refueling...)

		// const { tankers, aircraft } = gameboardMeta.refuel;
		//need to send to the server what selections were made, for it to handle it...

		const { gameboardMeta } = getState();
		const { aircraft, tankers } = gameboardMeta.refuel;

		const clientAction = {
			type: SERVER_CONFIRM_FUEL_SELECTION,
			payload: {
				aircraft,
				tankers
			}
		};

		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default confirmFuelSelections;
