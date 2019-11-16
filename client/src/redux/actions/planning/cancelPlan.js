import { CANCEL_PLAN, SERVER_DELETE_PLAN } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";

//TODO: rename cancelPlan to deletePlan to match the server side function (possibly match all client/server functions with each other...)
const cancelPlan = () => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta } = getState();

        if (gameboardMeta.planning.active) {
            dispatch({ type: CANCEL_PLAN });
        } else {
            //check to see if there is a piece selected and if that piece has a confirmed plan
            if (gameboardMeta.selectedPiece !== null && gameboardMeta.selectedPiece.pieceId in gameboardMeta.confirmedPlans) {
                //delete the plans from the database request
                const clientAction = {
                    type: SERVER_DELETE_PLAN,
                    payload: {
                        pieceId: gameboardMeta.selectedPiece.pieceId
                    }
                };
                emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
            } else {
                dispatch(setUserfeedbackAction("Must select a piece to delete + already have a plan for it to cancel/delete"));
            }
        }
    };
};

export default cancelPlan;
