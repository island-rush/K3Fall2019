const { Game, InvItem, ShopItem } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { SHOP_TRANSFER } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/gameData/otherConstants";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { PURCHASE_PHASE_ID, TYPE_MAIN } from "../../../client/src/gameData/gameConstants";

/***
 * TODO: standard function descriptions (author?, arguments, returns, why/when used?)
 * Transfers ShopItems into InvItems ("confirms" them, no longer able to refund once inside inventory...)
 */

const shopConfirmPurchase = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const thisGame = await new Game({ gameId }).init();

    const { gameActive, gamePhase } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //gamePhase 1 is only phase for confirming purchase
    if (gamePhase != PURCHASE_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //Only the main controller (0) can confirm purchase
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Not the main controller (0)...");
        return;
    }

    await InvItem.insertFromShop(gameId, gameTeam);
    await ShopItem.deleteAll(gameId, gameTeam);
    const invItems = await InvItem.all(gameId, gameTeam);

    const serverAction = {
        type: SHOP_TRANSFER,
        payload: {
            invItems
        }
    };
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = shopConfirmPurchase;
