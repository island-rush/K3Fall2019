import { PIECE_OPEN_ACTION } from "../actionTypes";
import { CONTAINER_TYPES } from "../../../constants/gameConstants";
import setUserFeedbackAction from "../setUserfeedbackAction";

const pieceOpen = selectedPiece => {
    return (dispatch, getState, emit) => {
        const { gameboard } = getState();

        const { pieceTypeId } = selectedPiece;

        //TODO: only show pieces that could go inside this container (specify that to the reducer?)
        //TODO: do these checks on the backend as well
        //TODO: are there any situations when we would not want players to look inside containers? (not likely)

        //don't want to open pieces that aren't container types
        if (!CONTAINER_TYPES.includes(pieceTypeId)) {
            dispatch(setUserFeedbackAction("Not a piece that can hold other pieces..."));
            return;
        }

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
