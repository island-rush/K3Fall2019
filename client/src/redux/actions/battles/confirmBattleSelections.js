import setUserfeedbackAction from "../setUserfeedbackAction";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../gameData/otherConstants";
import { SERVER_CONFIRM_BATTLE_SELECTION } from "../actionTypes";
import { WAITING_STATUS } from "../../../gameData/gameConstants";

const confirmBattleSelections = () => {
    return (dispatch, getState, emit) => {
        //check the local state before sending to the server
        const { gameboardMeta, gameInfo } = getState();
        const { gameStatus } = gameInfo;

        //TODO: could do loads more checks on current status of gameplay to prevent accidental presses? (but same checks on backend probably)
        if (gameStatus === WAITING_STATUS) {
            //already waiting
            dispatch(setUserfeedbackAction("already waiting, client prevented something..."));
            return;
        }

        const { friendlyPieces } = gameboardMeta.battle;
        //need to send to the server what selections were made, for it to handle it...

        const clientAction = {
            type: SERVER_CONFIRM_BATTLE_SELECTION,
            payload: {
                friendlyPieces
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default confirmBattleSelections;
