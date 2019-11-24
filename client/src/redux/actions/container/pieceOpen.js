import { PIECE_OPEN_ACTION } from "../actionTypes";

const pieceOpen = selectedPiece => {
    return (dispatch, getState, emit) => {
        const { gameboard } = getState();

        dispatch({
            type: PIECE_OPEN_ACTION,
            payload: {
                selectedPiece,
                gameboard
            }
        });
    };
};

export default pieceOpen;
