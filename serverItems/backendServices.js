const md5 = require("md5");
const fs = require("fs");

// const csvparse = require("csv-array");
// let distanceMatrix = [];
// csvparse.parseCSV(
// 	"./distanceMatrix",
// 	data => {
// 		distanceMatrix = data;
// 	},
// 	false
// );

const {
	INITIAL_GAMESTATE,
	SHOP_PURCHASE,
	SHOP_REFUND,
	SET_USERFEEDBACK,
	SHOP_TRANSFER,
	shopItemTypeCosts
} = require("./constants");

const pool = require("./database");
// pool = pool.promise();

const shopPurchaseRequest = (socket, shopItemTypeId) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//TODO: figure out if the purchase is allowed (game phase...controller Id....game active....)

	const pointsField = `game${gameTeam}Points`;

	pool.getConnection((error, connection) => {
		connection.query(
			"SELECT ?? as points FROM games WHERE gameId = ?",
			[pointsField, gameId],
			(error, results, fields) => {
				const teamPoints = results[0].points;
				const shopItemCost = shopItemTypeCosts[shopItemTypeId];

				if (teamPoints >= shopItemCost) {
					connection.query(
						"UPDATE games SET ?? = ?? - ? WHERE gameId = ?",
						[pointsField, pointsField, shopItemCost, gameId],
						(error, results, fields) => {
							connection.query(
								"INSERT INTO shopItems (shopItemGameId, shopItemTeamId, shopItemTypeId) values (?, ?, ?)",
								[gameId, gameTeam, shopItemTypeId],
								(error, results, fields) => {
									connection.release();
									const shopItem = {
										shopItemId: results.insertId,
										shopItemGameId: gameId,
										shopItemTeamId: gameTeam,
										shopItemTypeId: shopItemTypeId
									};

									const pointsRemaining = teamPoints - shopItemCost;

									const serverAction = {
										type: SHOP_PURCHASE,
										payload: {
											shopItem: shopItem,
											points: pointsRemaining
										}
									};
									socket.emit("serverSendingAction", serverAction);
									return;
								}
							);
						}
					);
				} else {
					const serverAction = {
						type: SET_USERFEEDBACK,
						payload: {
							userFeedback: "Not enough points to purchase"
						}
					};
					socket.emit("serverSendingAction", serverAction);
					return;
				}
			}
		);
	});
};

const shopRefundRequest = (socket, shopItem) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//verify that the refund is available (correct controller, game active....)
	//verify that the piece exists and the object given matches database values (overkill)

	const pointsField = `game${gameTeam}Points`;
	const itemCost = shopItemTypeCosts[shopItem.shopItemTypeId];

	pool.getConnection((error, connection) => {
		connection.query(
			"UPDATE games SET ?? = ?? + ? WHERE gameId = ?",
			[pointsField, pointsField, itemCost, gameId],
			(error, results, fields) => {
				//get rid of the item
				connection.query(
					"DELETE FROM shopItems WHERE shopItemId = ?",
					[shopItem.shopItemId],
					(error, results, fields) => {
						//probably check success of deletion?
						connection.release();

						const serverAction = {
							type: SHOP_REFUND,
							payload: {
								shopItem: shopItem,
								pointsAdded: itemCost
							}
						};
						socket.emit("serverSendingAction", serverAction);
					}
				);
			}
		);
	});
};

const shopConfirmPurchase = socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//verify if it is allowed, game active, phase, controller...

	pool.getConnection((error, connection) => {
		connection.query(
			"INSERT INTO invItems (invItemId, invItemGameId, invItemTeamId, invItemTypeId) SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?",
			[gameId, gameTeam],
			(error, results, fields) => {
				connection.query(
					"DELETE FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?",
					[gameId, gameTeam],
					(error, results, fields) => {
						connection.query(
							"SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?",
							[gameId, gameTeam],
							(error, results, fields) => {
								connection.release();
								const serverAction = {
									type: SHOP_TRANSFER,
									payload: {
										invItems: results
									}
								};
								socket.emit("serverSendingAction", serverAction);
								return;
							}
						);
					}
				);
			}
		);
	});
};

const logout = socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const controllerLoginField =
		"game" + gameTeam + "Controller" + gameController;

	pool.query(
		"UPDATE games SET ?? = 0 WHERE gameId = ?",
		[controllerLoginField, gameId],
		(error, results, fields) => {}
	);
};

// ----------------------------------------------------------------------------------------
// Socket Requests (Gameplay Client <-|-> Server)
// ----------------------------------------------------------------------------------------
