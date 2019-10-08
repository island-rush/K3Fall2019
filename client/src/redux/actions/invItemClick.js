import setUserfeedbackAction from "./setUserfeedbackAction";
import { CLIENT_SENDING_ACTION } from "../socketEmits";

const invItemClick = invItem => {
	return (dispatch, getState, emit) => {
		//check to see if allowed to use this inv item?
		//check locally before sending request...but ultimately still check on the server side

		const { gameboardMeta, gameInfo } = getState();
		const { selectedPosition } = gameboardMeta;
		const { gamePhase } = gameInfo;

		const { invItemId, invItemTypeId } = invItem;

		//place reinforcements...clicking should transfer the piece to the selected position
		if (gamePhase === 3) {
			if (selectedPosition === -1) {
				dispatch(setUserfeedbackAction("Must select a position before using an inv item..."));
				return;
			}

			//placing an actual piece and not a special thing?
			if (invItemTypeId <= 19) {
				//need to delete the inv item
				//need to create the piece
				//need to place the piece on the board at the spot

				const clientAction = {
					type: "piecePlace",
					payload: {
						invItemId,
						selectedPosition
					}
				};

				emit(CLIENT_SENDING_ACTION, clientAction);
			}
		}
	};
};

export default invItemClick;
