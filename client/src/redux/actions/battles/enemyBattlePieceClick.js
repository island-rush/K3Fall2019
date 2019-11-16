import setUserfeedbackAction from "../setUserfeedbackAction";
import { ENEMY_PIECE_SELECT } from "../actionTypes";
import { WAITING_STATUS } from "../../../constants/gameConstants";

const enemyBattlePieceClick = (battlePiece, battlePieceIndex) => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta, gameInfo } = getState();
        const { gameStatus } = gameInfo;

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction("can't do more, already submitted (status == 1)"));
            return;
        }

        const { selectedBattlePiece, selectedBattlePieceIndex } = gameboardMeta.battle;

        if (selectedBattlePiece === -1 || selectedBattlePieceIndex === -1) {
            dispatch(setUserfeedbackAction("Must select piece to attack with.."));
        } else {
            dispatch({
                type: ENEMY_PIECE_SELECT,
                payload: {
                    battlePiece,
                    battlePieceIndex
                }
            });
        }
    };
};

export default enemyBattlePieceClick;
