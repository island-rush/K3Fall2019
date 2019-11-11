import setUserfeedbackAction from "../setUserfeedbackAction";
import { SERVER_RAISE_MORALE_CONFIRM } from "../actionTypes";
import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const raiseMoraleSelectCommanderType = selectedCommanderType => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta } = getState();
		const { invItem } = gameboardMeta.planning;

		//TODO: make this a better if check (use constants, check for all other types of commanders (not just a range))
		if (selectedCommanderType < 0) {
			dispatch(setUserfeedbackAction("didn't select valid commander type"));
			return;
		}

		const clientAction = {
			type: SERVER_RAISE_MORALE_CONFIRM,
			payload: {
				invItem,
				selectedCommanderType
			}
		};
		emit(CLIENT_SENDING_ACTION, clientAction);
		return;
	};
};

export default raiseMoraleSelectCommanderType;
