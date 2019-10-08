import setUserfeedbackAction from "../setUserfeedbackAction";
import { CLIENT_SENDING_ACTION } from "../../socketEmits";

const confirmBattleSelections = () => {
	return (dispatch, getState, emit) => {
		//check the local state before sending to the server
		const { gameboardMeta, gameInfo } = getState();
		const { gameStatus } = gameInfo;

		//TODO: could do loads more checks on current status of gameplay to prevent accidental presses? (but same checks on backend probably)
		if (gameStatus === 1) {
			//already waiting
			dispatch(setUserfeedbackAction("already waiting, client prevented something..."));
			return;
		}

		const { friendlyPieces } = gameboardMeta.battle;
		//need to send to the server what selections were made, for it to handle it...

		const clientAction = {
			type: "confirmBattleSelection",
			payload: {
				friendlyPieces
			}
		};

		emit(CLIENT_SENDING_ACTION, clientAction);
	};
};

export default confirmBattleSelections;
