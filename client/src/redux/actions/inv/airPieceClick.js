import setUserfeedbackAction from "../setUserfeedbackAction";
import { CLIENT_SENDING_ACTION } from "../../socketEmits";
import { SERVER_PIECE_PLACE } from "../actionTypes";
import { PLACE_PHASE_ID } from "../../../gameData/gameConstants";

const airPieceClick = invItem => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta, gameInfo } = getState();

        const { gamePhase } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase to place air inv item."));
            return;
        }

        const { selectedPosition } = gameboardMeta;

        if (selectedPosition === -1) {
            dispatch(setUserfeedbackAction("Must select a position before using an inv item..."));
            return;
        }

        //TODO: Is this position an airfield or aircraft carrier?
        //Do we own the airfield? (does it need to be main island?) (any game effects preventing it?)
        //Do other checks for rules on placing planes...

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

export default airPieceClick;
