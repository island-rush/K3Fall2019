import { TARGET_PIECE_SELECT } from "../actionTypes";
import { WAITING_STATUS } from "../../../gameData/gameConstants";

const targetPieceClick = (battlePiece, battlePieceIndex) => {
    return (dispatch, getState, emit) => {
        //check the local state before sending to the server

        const { gameInfo } = getState();
        const { gameStatus } = gameInfo;
        if (gameStatus === WAITING_STATUS) {
            return;
        }

        dispatch({
            type: TARGET_PIECE_SELECT,
            payload: {
                battlePiece,
                battlePieceIndex
            }
        });
    };
};

export default targetPieceClick;
