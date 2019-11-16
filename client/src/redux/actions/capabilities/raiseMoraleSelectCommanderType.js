import setUserfeedbackAction from "../setUserfeedbackAction";
import { SERVER_RAISE_MORALE_CONFIRM } from "../actionTypes";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";
import { ALL_COMMANDER_TYPES } from "../../../constants/gameConstants";

const raiseMoraleSelectCommanderType = selectedCommanderType => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta } = getState();
        const { invItem } = gameboardMeta.planning;

        if (!ALL_COMMANDER_TYPES.includes(selectedCommanderType)) {
            dispatch(setUserfeedbackAction("didn't select valid commander type"));
            return;
        }

        const clientAction = {
            type: SERVER_RAISE_MORALE_CONFIRM,
            payload: {
                invItem,
                selectedCommanderType
            }
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
        return;
    };
};

export default raiseMoraleSelectCommanderType;
