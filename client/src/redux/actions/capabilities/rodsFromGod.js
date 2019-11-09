import setUserfeedbackAction from "../setUserfeedbackAction";
import { RODS_FROM_GOD_SELECTING } from "../actionTypes";

const rodsFromGod = invItem => {
	return (dispatch, getState, emit) => {
		const { gameInfo } = getState();
		const { gamePhase, gameSlice } = gameInfo;

		if (gamePhase !== 2) {
			dispatch(setUserfeedbackAction("wrong phase for rods from god dude."));
			return;
		}

		if (gameSlice !== 0) {
			dispatch(setUserfeedbackAction("must be in planning to use rods from god."));
			return;
		}

		//other checks that the player is allowed to select rods from god (do they have it? / game effects...)

		//dispatch that the player is currently selecting which position to select
		dispatch({
			type: RODS_FROM_GOD_SELECTING,
			payload: {
				invItem
			}
		});
	};
};

export default rodsFromGod;
