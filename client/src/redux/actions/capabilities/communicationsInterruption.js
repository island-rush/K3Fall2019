import setUserfeedbackAction from "../setUserfeedbackAction";
import { COMM_INTERRUPT_SELECTING } from "../actionTypes";
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from "../../../constants/gameConstants";

const communicationsInterruption = invItem => {
    return (dispatch, getState, emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase for comm interrupt dude."));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction("must be in planning to use comm interrupt."));
            return;
        }

        //other checks that the player is allowed to select comm interrupt (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        dispatch({
            type: COMM_INTERRUPT_SELECTING,
            payload: {
                invItem
            }
        });
    };
};

export default communicationsInterruption;
