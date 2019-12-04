import { SERVER_INNER_PIECE_CLICK } from "../actionTypes";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";

const innerPieceClick = (selectedPiece, containerPiece) => {
    return (dispatch, getState, emit) => {
        //TODO: figure out if inner piece click is allowed

        const clientAction = {
            type: SERVER_INNER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);

        // dispatch({
        //     type: INNER_PIECE_CLICK_ACTION,
        //     payload: {
        //         selectedPiece
        //     }
        // });
    };
};

export default innerPieceClick;
