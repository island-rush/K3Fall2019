import setUserfeedbackAction from "../setUserfeedbackAction";
import { START_PLAN } from "../actionTypes";
import { TYPE_OWNERS } from "../../../gameData/gameConstants";

//TODO: need more checks on all the frontend planning functions (gamePhase/gameSlice...)
const startPlan = () => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta, gameInfo } = getState();

        if (gameboardMeta.selectedPiece == null) {
            dispatch(setUserfeedbackAction("Must select a piece to plan a move..."));
            return;
        }
        const { selectedPiece } = gameboardMeta;
        const { gameControllers } = gameInfo;

        let atLeast1Owner = false;
        for (let x = 0; x < gameControllers.length; x++) {
            let gameController = gameControllers[x];
            if (TYPE_OWNERS[gameController].includes(selectedPiece.pieceTypeId)) {
                atLeast1Owner = true;
                break;
            }
        }

        if (!atLeast1Owner) {
            dispatch(setUserfeedbackAction("Piece doesn't fall under your control"));
            return;
        }

        if (gameboardMeta.planning.active) {
            dispatch(setUserfeedbackAction("Already planning a move..."));
            return;
        }

        dispatch({ type: START_PLAN, payload: {} });
    };
};

export default startPlan;
