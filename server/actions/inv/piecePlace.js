const { Game, InvItem } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { PIECE_PLACE } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/constants/otherConstants";
import { BAD_REQUEST_TAG, GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { PLACE_PHASE_ID, TYPE_OWNERS, TYPE_TERRAIN } from "../../../client/src/constants/gameConstants";
import { initialGameboardEmpty } from "../../../client/src/redux/reducers/initialGameboardEmpty";

const piecePlace = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const { invItemId, selectedPosition } = payload;

    const thisGame = await new Game({ gameId }).init();
    const { gameActive, gamePhase } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //Can only place pieces from inv during 'place reinforcements phase' (3)
    if (gamePhase != PLACE_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socket, "Inv Item did not exist...");
        return;
    }

    const { invItemGameId, invItemTeamId, invItemTypeId } = thisInvItem;

    //Do they own this item?
    if (invItemGameId != gameId || invItemTeamId != gameTeam) {
        socket.emit(SOCKET_SERVER_REDIRECT, BAD_REQUEST_TAG);
        return;
    }

    //Could be multiple controller
    let atLeast1Owner = false;
    for (let gameController of gameControllers) {
        if (TYPE_OWNERS[gameController].includes(invItemTypeId)) {
            atLeast1Owner = true;
            break;
        }
    }

    if (!atLeast1Owner) {
        sendUserFeedback(socket, "Piece doesn't fall under your control");
        return;
    }

    //valid position on the board?
    if (selectedPosition < 0) {
        sendUserFeedback(socket, "Not a valid position on the board (negative)");
        return;
    }

    //valid terrain for this piece?
    let { type } = initialGameboardEmpty[selectedPosition];
    if (!TYPE_TERRAIN[invItemTypeId].includes(type)) {
        sendUserFeedback(socket, "can't go on that terrain with this piece type");
        return;
    }

    //TODO: need to make sure pieces are put onto main island (or surrounding waters)

    //for radars (and possibly other units)
    //need to verify that island is owned by us
    //need to verify that there is another ground unit on the hex (and no other enemy units)

    const newPiece = await thisInvItem.placeOnBoard(selectedPosition); //should also check that this piece actually got created, could return null (should return null if it failed...TODO: return null if failed...)

    //TODO: Should probably also write down how the state is stored on the frontend eventually, so others know how it works
    newPiece.pieceContents = { pieces: [] }; //new pieces have nothing in them, and piece contents is required for the frontend...

    const serverAction = {
        type: PIECE_PLACE,
        payload: {
            invItemId,
            positionId: selectedPosition,
            newPiece
        }
    };

    //need to send this to the whole team
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = piecePlace;
