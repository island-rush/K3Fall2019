const { Game, Piece } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { SHOP_REFUND, OUTER_PIECE_CLICK_ACTION, INNER_PIECE_CLICK_ACTION } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_SENDING_ACTION, SOCKET_SERVER_REDIRECT } from "../../../client/src/constants/otherConstants";
import { GAME_INACTIVE_TAG, BAD_REQUEST_TAG } from "../../pages/errorTypes";
import { TYPE_COSTS, PURCHASE_PHASE_ID, TYPE_MAIN, BLUE_TEAM_ID, COMBAT_PHASE_ID, SLICE_PLANNING_ID, CONTAINER_TYPES } from "../../../client/src/constants/gameConstants";

const exitContainer = async (socket, payload) => {
    //Get info from client
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const { selectedPiece, containerPiece } = payload;

    //Get info for this game
    const thisGame = await new Game({ gameId }).init();
    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Not the right controller type for this action...");
        return;
    }

    if (gamePhase != COMBAT_PHASE_ID || gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right phase/slice for container entering.");
        return;
    }

    //Get info for pieces involved in this action
    const thisSelectedPiece = await new Piece(selectedPiece.pieceId).init();
    const thisContainerPiece = await new Piece(containerPiece.pieceId).init();

    if (!thisSelectedPiece) {
        sendUserFeedback(socket, "Selected Piece did not exists...refresh page probably");
        return;
    }

    if (!thisContainerPiece) {
        sendUserFeedback(socket, "Selected Container piece did not exist...");
        return;
    }

    if (!CONTAINER_TYPES.includes(thisContainerPiece.pieceTypeId)) {
        sendUserFeedback(socket, "Selected Container piece was not a container type");
        return;
    }

    await Piece.putOutsideContainer(thisSelectedPiece.pieceId, thisSelectedPiece.piecePositionId);

    const serverAction = {
        type: INNER_PIECE_CLICK_ACTION,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
            selectedPiece,
            containerPiece
        }
    };
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = exitContainer;
