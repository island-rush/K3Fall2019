import setUserfeedbackAction from "../setUserfeedbackAction";
import { RAISE_MORALE_SELECTING } from "../actionTypes";

//TODO: need to get rid of boost = x from the component when the raise morale is expired

const raiseMorale = invItem => {
	return (dispatch, getState, emit) => {
		const { gameInfo } = getState();
		const { gamePhase, gameSlice } = gameInfo;

		//TODO: change these gamePhases into constants for better game logic sense
		if (gamePhase !== 2) {
			dispatch(setUserfeedbackAction("wrong phase for raise morale dude."));
			return;
		}

		//TODO: change gameSlice into named constants...
		if (gameSlice !== 0) {
			dispatch(setUserfeedbackAction("must be in planning to use raise morale."));
			return;
		}

		//other checks that the player is allowed to select raise morale (do they have it? / game effects...)

		//dispatch that the player is currently selecting which commander type to boost
		dispatch({
			type: RAISE_MORALE_SELECTING,
			payload: {
				invItem
			}
		});
	};
};

export default raiseMorale;
