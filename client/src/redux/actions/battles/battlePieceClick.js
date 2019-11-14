import setUserfeedbackAction from "../setUserfeedbackAction";
import { BATTLE_PIECE_SELECT } from "../actionTypes";
import { WAITING_STATUS } from "../../../gameData/gameConstants";

const battlePieceClick = (battlePiece, battlePieceIndex) => {
    return (dispatch, getState, emit) => {
        const { gameInfo } = getState();
        const { gameStatus } = gameInfo;
        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction("can't make more selections, status == 1, already submitted probably"));
            return;
        }

        dispatch({
            type: BATTLE_PIECE_SELECT,
            payload: {
                battlePiece,
                battlePieceIndex
            }
        });
    };
};

export default battlePieceClick;
