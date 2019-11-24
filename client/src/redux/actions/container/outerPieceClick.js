import { SERVER_OUTER_PIECE_CLICK } from "../actionTypes";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";

const outerPieceClick = (selectedPiece, containerPiece) => {
    return (dispatch, getState, emit) => {
        //TODO: figure out if this is allowed (like all other actions)

        const clientAction = {
            type: SERVER_OUTER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default outerPieceClick;
