import { PIECE_CLOSE_ACTION } from "../actionTypes";

const pieceClose = selectedPiece => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            dispatch({
                type: PIECE_CLOSE_ACTION,
                payload: {
                    selectedPiece
                }
            });
        }
    };
};

export default pieceClose;
