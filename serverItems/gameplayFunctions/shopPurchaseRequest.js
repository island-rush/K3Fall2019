const { Game, ShopItem } = require("../classes");
const { GAME_INACTIVE_TAG, SHOP_ITEM_TYPE_COSTS, SHOP_PURCHASE } = require("../constants");
const sendUserFeedback = require("./sendUserFeedback");

const shopPurchaseRequest = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const { shopItemTypeId } = payload; //TODO: could check payloads for all these gameFunctions before destructuring them...

	const thisGame = await new Game({ gameId }).init();
	const { gameActive, gamePhase, game0Points, game1Points } = thisGame;

	if (!gameActive) {
		socket.emit("serverRedirect", GAME_INACTIVE_TAG);
		return;
	}

	//gamePhase 1 is only phase for purchasing
	if (gamePhase != 1) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}

	//Only the main controller (0) can buy things
	if (gameController != 0) {
		sendUserFeedback(socket, "Not the main controller (0)...");
		return;
	}

	const shopItemCost = SHOP_ITEM_TYPE_COSTS[shopItemTypeId];
	const teamPoints = gameTeam == 0 ? game0Points : game1Points;

	if (teamPoints < shopItemCost) {
		sendUserFeedback(socket, "Not enough points to purchase");
		return;
	}

	const newPoints = teamPoints - shopItemCost;
	await thisGame.setPoints(gameTeam, newPoints);

	const shopItem = await ShopItem.insert(gameId, gameTeam, shopItemTypeId);

	//TODO: payload could be more standard?
	const serverAction = {
		type: SHOP_PURCHASE,
		payload: {
			shopItem,
			points: newPoints
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

module.exports = shopPurchaseRequest;
