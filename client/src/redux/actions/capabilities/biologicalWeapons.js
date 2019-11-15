import setUserfeedbackAction from "../setUserfeedbackAction";
import { BIO_WEAPON_SELECTING } from "../actionTypes";
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from "../../../gameData/gameConstants";

const biologicalWeapons = invItem => {
    return (dispatch, getState, emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase for bio weapons dude."));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction("must be in planning to use bio weapons."));
            return;
        }

        //other checks that the player is allowed to select bio weapons (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        dispatch({
            type: BIO_WEAPON_SELECTING,
            payload: {
                invItem
            }
        });
    };
};

export default biologicalWeapons;
