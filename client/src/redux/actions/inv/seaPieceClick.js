import setUserfeedbackAction from "../setUserfeedbackAction";
import { CLIENT_SENDING_ACTION } from "../../socketEmits";
import { SERVER_PIECE_PLACE } from "../actionTypes";

const seaPieceClick = invItem => {
	return (dispatch, getState, emit) => {
		const { gameboardMeta, gameInfo } = getState();

		const { gamePhase } = gameInfo;

		if (gamePhase !== 3) {
			dispatch(setUserfeedbackAction("wrong phase to place sea inv item."));
			return;
		}

		const { selectedPosition } = gameboardMeta;

		if (selectedPosition === -1) {
			dispatch(setUserfeedbackAction("Must select a position before using an inv item..."));
			return;
		}

		//TODO: Is this position a sea position or around the island we own?
		//other game effects that might prevent placing it...

		const { invItemId } = invItem; //TODO: send the whole item anyway? (even though the server only uses the id, consistent...)

		const clientAction = {
			type: SERVER_PIECE_PLACE,
			payload: {
				invItemId,
				selectedPosition
			}
		};

		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default seaPieceClick;
