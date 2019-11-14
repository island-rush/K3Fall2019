import setUserfeedbackAction from "../setUserfeedbackAction";
import { GOLDEN_EYE_SELECTING } from "../actionTypes";

const goldenEye = invItem => {
    return (dispatch, getState, emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== 2) {
            dispatch(setUserfeedbackAction("wrong phase for golden eye dude."));
            return;
        }

        if (gameSlice !== 0) {
            dispatch(setUserfeedbackAction("must be in planning to use golden eye."));
            return;
        }

        //other checks that the player is allowed to select golden eye (do they have it? / game effects...)

        //dispatch that the player is currently selecting area to select
        dispatch({
            type: GOLDEN_EYE_SELECTING,
            payload: {
                invItem
            }
        });
    };
};

export default goldenEye;
