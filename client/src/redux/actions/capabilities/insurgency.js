import setUserfeedbackAction from "../setUserfeedbackAction";
import { INSURGENCY_SELECTING } from "../actionTypes";
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from "../../../constants/gameConstants";

const insurgency = invItem => {
    return (dispatch, getState, emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase for insurgency dude."));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction("must be in planning to use insurgency."));
            return;
        }

        //other checks that the player is allowed to select insurgency (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        dispatch({
            type: INSURGENCY_SELECTING,
            payload: {
                invItem
            }
        });
    };
};

export default insurgency;
