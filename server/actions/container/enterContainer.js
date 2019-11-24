const { Game, Piece } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { SHOP_REFUND, OUTER_PIECE_CLICK_ACTION } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_SENDING_ACTION, SOCKET_SERVER_REDIRECT } from "../../../client/src/constants/otherConstants";
import { GAME_INACTIVE_TAG, BAD_REQUEST_TAG } from "../../pages/errorTypes";
import { TYPE_COSTS, PURCHASE_PHASE_ID, TYPE_MAIN, BLUE_TEAM_ID } from "../../../client/src/constants/gameConstants";

const enterContainer = async (socket, payload) => {
    //put the piece from the payload, into the container

    //TODO: verify
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const thisGame = await new Game({ gameId }).init();

    //TODO: verify
    const { selectedPiece, containerPiece } = payload;

    //need to update these container id's

    //need to let client(s) know about the container change (send them full pieces update if lazy)

    const containerPieceId = containerPiece.pieceId;
    const selectedPieceId = selectedPiece.pieceId;

    await Piece.putInsideContainer(selectedPieceId, containerPieceId);

    const serverAction = {
        type: OUTER_PIECE_CLICK_ACTION,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
            selectedPiece,
            containerPiece
        }
    };
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = enterContainer;
