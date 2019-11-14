const { Game, ShopItem } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { SHOP_REFUND } from "../../../client/src/redux/actions/actionTypes";
import { SERVER_SENDING_ACTION, SERVER_REDIRECT } from "../../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG, BAD_REQUEST_TAG } from "../../pages/errorTypes";
import { TYPE_COSTS, PURCHASE_PHASE_ID, TYPE_MAIN, BLUE_TEAM_ID } from "../../../client/src/gameData/gameConstants";

const shopRefundRequest = async (socket, payload) => {
    const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
    const thisGame = await new Game({ gameId }).init();

    const { gameActive, gamePhase, game0Points, game1Points } = thisGame;

    if (!gameActive) {
        socket.emit(SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //gamePhase 1 is only phase for refunds
    if (gamePhase != PURCHASE_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //Only the main controller (0) can refund things
    if (gameController != TYPE_MAIN) {
        sendUserFeedback(socket, "Not the main controller (0)...");
        return;
    }

    //Does the item exist?
    const { shopItemId } = payload.shopItem;
    const thisShopItem = await new ShopItem(shopItemId).init();
    if (!thisShopItem) {
        sendUserFeedback(socket, "Shop Item did not exist...");
        return;
    }

    const { shopItemGameId, shopItemTeamId, shopItemTypeId } = thisShopItem; //get shopItem details from database, not user

    //Do they own the shop item?
    if (shopItemGameId != gameId || shopItemTeamId != gameTeam) {
        socket.emit(SERVER_REDIRECT, BAD_REQUEST_TAG);
        return;
    }

    const itemCost = TYPE_COSTS[shopItemTypeId];
    const teamPoints = gameTeam == BLUE_TEAM_ID ? game0Points : game1Points;

    //Refund the shopItem
    const newPoints = teamPoints + itemCost;
    await thisGame.setPoints(gameTeam, newPoints);
    await thisShopItem.delete();

    const serverAction = {
        type: SHOP_REFUND,
        payload: {
            shopItemId, //is this used on the frontend?
            pointsAdded: itemCost
        }
    };
    socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = shopRefundRequest;
