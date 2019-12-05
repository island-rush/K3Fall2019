import { distanceMatrix } from "../../constants/distanceMatrix";
import {
    REMOTE_SENSING_RANGE,
    COMM_INTERRUPT_RANGE,
    REMOTE_SENSING_TYPE_ID,
    COMMUNICATIONS_INTERRUPTION_TYPE_ID,
    RODS_FROM_GOD_TYPE_ID,
    INSURGENCY_TYPE_ID,
    BIOLOGICAL_WEAPONS_TYPE_ID,
    GOLDEN_EYE_TYPE_ID,
    GOLDEN_EYE_RANGE,
    TYPE_TERRAIN
} from "../../constants/gameConstants";
import {
    POSITION_SELECT,
    PLANNING_SELECT,
    HIGHLIGHT_POSITIONS,
    SERVER_INSURGENCY_CONFIRM,
    SERVER_REMOTE_SENSING_CONFIRM,
    SERVER_RODS_FROM_GOD_CONFIRM,
    SERVER_BIOLOGICAL_WEAPONS_CONFIRM,
    SERVER_COMM_INTERRUPT_CONFIRM,
    SERVER_GOLDEN_EYE_CONFIRM,
    SERVER_INNER_TRANSPORT_PIECE_CLICK
} from "./actionTypes";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../constants/otherConstants";
import setUserFeedbackAction from "./setUserfeedbackAction";
import { initialGameboardEmpty } from "../reducers/initialGameboardEmpty";

const selectPosition = selectedPositionId => {
    return (dispatch, getState, emit) => {
        const { gameboardMeta } = getState();

        //selecting the hex to put piece that is inside container
        if (gameboardMeta.container.isSelectingHex) {
            //TODO: check that the position selected was valid
            //TODO: check that the position was vaild (on the server side)

            //other checks
            const thisAction = {
                type: SERVER_INNER_TRANSPORT_PIECE_CLICK,
                payload: {
                    selectedPiece: gameboardMeta.container.innerPieceToDrop,
                    containerPiece: gameboardMeta.container.containerPiece,
                    selectedPositionId
                }
            };

            emit(SOCKET_CLIENT_SENDING_ACTION, thisAction);

            return;
        }

        if (!gameboardMeta.planning.active) {
            //select anything and highlight, looking at the position
            dispatch({
                type: POSITION_SELECT,
                payload: {
                    selectedPositionId
                }
            });
            return;
        }

        //is actively planning
        if (selectedPositionId === -1 && !gameboardMeta.planning.capability) {
            dispatch(setUserFeedbackAction("Must select a position for the plan..."));
            return;
        }

        //Currently for 'rods from god' but will likely be used for other capabilities (non-piece selections on the board (with planning))
        if (gameboardMeta.planning.capability) {
            //highlight if needed
            if (gameboardMeta.planning.invItem.invItemTypeId === REMOTE_SENSING_TYPE_ID) {
                let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= REMOTE_SENSING_RANGE) {
                        highlightedPositions.push(x);
                    }
                }

                dispatch({
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                });
            }

            if (gameboardMeta.planning.invItem.invItemTypeId === COMMUNICATIONS_INTERRUPTION_TYPE_ID) {
                let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= COMM_INTERRUPT_RANGE) highlightedPositions.push(x);
                }

                dispatch({
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                });
            }

            if (gameboardMeta.planning.invItem.invItemTypeId === GOLDEN_EYE_TYPE_ID) {
                let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= GOLDEN_EYE_RANGE) highlightedPositions.push(x);
                }

                dispatch({
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                });
            }

            // eslint-disable-next-line no-restricted-globals
            if (confirm("Are you sure you want to use capability on this position?")) {
                let type;
                switch (gameboardMeta.planning.invItem.invItemTypeId) {
                    case RODS_FROM_GOD_TYPE_ID:
                        type = SERVER_RODS_FROM_GOD_CONFIRM;
                        break;
                    case REMOTE_SENSING_TYPE_ID:
                        type = SERVER_REMOTE_SENSING_CONFIRM;
                        break;
                    case INSURGENCY_TYPE_ID:
                        type = SERVER_INSURGENCY_CONFIRM;
                        break;
                    case BIOLOGICAL_WEAPONS_TYPE_ID:
                        type = SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
                        break;
                    case COMMUNICATIONS_INTERRUPTION_TYPE_ID:
                        type = SERVER_COMM_INTERRUPT_CONFIRM;
                        break;
                    case GOLDEN_EYE_TYPE_ID:
                        type = SERVER_GOLDEN_EYE_CONFIRM;
                        break;
                    default:
                        dispatch(setUserFeedbackAction("unkown/not yet implemented invItemTypeId functionality (capability)"));
                        return;
                }

                //TODO: frontend action to change into a 'waiting on server' state?
                dispatch({
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions: []
                    }
                });

                const clientAction = {
                    type,
                    payload: {
                        selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition,
                        invItem: gameboardMeta.planning.invItem
                    }
                };

                emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
                return;
            }

            //select the position anyway
            dispatch({
                type: POSITION_SELECT,
                payload: {
                    selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition
                }
            });
            return;
        }

        var trueMoveCount = 0;
        for (var i = 0; i < gameboardMeta.planning.moves.length; i++) {
            const { type } = gameboardMeta.planning.moves[i];
            if (type === "move") {
                trueMoveCount++;
            }
        }

        if (trueMoveCount >= gameboardMeta.selectedPiece.pieceMoves) {
            dispatch(setUserFeedbackAction("Must move piece within range..."));
            return;
        }

        //from the selected position or the last move in the plan?
        const lastSelectedPosition =
            gameboardMeta.planning.moves.length > 0 ? gameboardMeta.planning.moves[gameboardMeta.planning.moves.length - 1].positionId : gameboardMeta.selectedPosition;

        if (distanceMatrix[lastSelectedPosition][selectedPositionId] !== 1) {
            dispatch(setUserFeedbackAction("Must select adjacent position..."));
            return;
        }

        //if we are planning (a non-capability), we assume there is a selectedPiece in the meta
        const { pieceTypeId } = gameboardMeta.selectedPiece;
        const { type } = initialGameboardEmpty[selectedPositionId];
        if (!TYPE_TERRAIN[pieceTypeId].includes(type)) {
            dispatch(setUserFeedbackAction("Wrong terrain type for this piece..."));
            return;
        }

        dispatch({
            type: PLANNING_SELECT,
            payload: {
                selectedPositionId
            }
        });
    };
};

export default selectPosition;
