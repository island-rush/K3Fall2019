const md5 = require("md5");
const fs = require("fs");
const INITIAL_GAMESTATE = "INITIAL_GAMESTATE";
const SHOP_PURCHASE = "SHOP_PURCHASE";
const SHOP_REFUND = "SHOP_REFUND";
const SET_USERFEEDBACK = "SET_USERFEEDBACK";

const shopItemTypeCosts = {
	//id: cost
	0: 10, //ship
	1: 10, //plane
	2: 10 //warfare
};

exports.gameAdd = (mysqlPool, req, callback) => {
	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		callback(false);
		return;
	}

	const adminPasswordHashed = md5(adminPassword);
	mysqlPool.query(
		"INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)",
		[adminSection, adminInstructor, adminPasswordHashed],
		(error, results, fields) => {
			if (error) {
				callback(false);
				return;
			} else {
				callback(true);
				return;
			}
		}
	);
};

exports.gameDelete = (mysqlPool, req, callback) => {
	const { gameId } = req.body;
	if (!gameId) {
		callback(false);
		return;
	}

	mysqlPool.query(
		"DELETE FROM games WHERE gameId = ?",
		[gameId],
		(error, results, fields) => {
			if (error) {
				callback(false);
				return;
			} else {
				callback(true);
				return;
			}
		}
	);
};

exports.databaseStatus = (mysqlPool, req, callback) => {
	mysqlPool.getConnection((err, connection) => {
		if (err) {
			callback(false);
		} else {
			callback(true);
			connection.release();
		}
	});
};

exports.getGames = (mysqlPool, req, callback) => {
	mysqlPool.query("SELECT * FROM games", (error, results, fields) => {
		if (error) {
			callback(JSON.stringify([]));
			return;
		}
		let games = [];
		for (let x = 0; x < results.length; x++) {
			games.push({
				gameId: results[x].gameId,
				gameSection: results[x].gameSection,
				gameInstructor: results[x].gameInstructor,
				gameActive: results[x].gameActive
			});
		}
		callback(JSON.stringify(games));
		return;
	});
};

exports.adminLoginVerify = (mysqlPool, req, callback) => {
	const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
	const CourseDirectorPassword =
		process.env.CD_PASSWORD || "912ec803b2ce49e4a541068d495ab570"; //"asdf"
	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		callback("/index.html?error=badRequest");
		return;
	}

	const adminPasswordHashed = md5(adminPassword);
	if (
		adminSection == "CourseDirector" &&
		adminInstructor == CourseDirectorLastName &&
		adminPasswordHashed == CourseDirectorPassword
	) {
		req.session.ir3 = { courseDirector: true };
		callback("/courseDirector.html");
		return;
	}

	mysqlPool.query(
		"SELECT gameId, gameAdminPassword FROM games WHERE gameSection = ? AND gameInstructor = ? ORDER BY gameId",
		[adminSection, adminInstructor],
		(error, results, fields) => {
			if (error) {
				callback("/index.html?error=database");
				return;
			}

			if (results.length != 1) {
				callback("/index.html?error=login");
				return;
			}

			const { gameId, gameAdminPassword } = results[0];
			if (gameAdminPassword != adminPasswordHashed) {
				callback("/index.html?error=login");
				return;
			}

			req.session.ir3 = {
				gameId: gameId,
				teacher: true
			};
			callback(
				`/teacher.html?section=${adminSection}&instructor=${adminInstructor}`
			);
			return;
		}
	);
};

exports.getGameActive = (mysqlPool, req, callback) => {
	const { gameId } = req.session.ir3;
	mysqlPool.query(
		"SELECT gameActive FROM games WHERE gameId = ?",
		[gameId],
		(error, results, fields) => {
			if (error) {
				callback(0);
				return;
			}
			callback(results[0].gameActive);
			return;
		}
	);
};

exports.toggleGameActive = (mysqlPool, req, callback) => {
	const { gameId } = req.session.ir3;
	mysqlPool.query(
		"UPDATE games SET gameActive = (gameActive + 1) % 2, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?",
		[gameId],
		(error, results, fields) => {
			//handle error (callback does not depend on success TODO: notify of failure?)
			callback();
			return;
		}
	);
};

exports.insertDatabaseTables = (mysqlPool, req, callback) => {
	const sql = fs.readFileSync("./server/sql/tableInsert.sql").toString();
	mysqlPool.query(sql, (error, results, fields) => {
		if (error) {
			console.log(error);
			callback("failed");
			return;
		} else {
			callback("success");
			return;
		}
	});
};

exports.gameLoginVerify = (mysqlPool, req, callback) => {
	const {
		gameSection,
		gameInstructor,
		gameTeam,
		gameTeamPassword,
		gameController
	} = req.body;
	if (
		!gameSection ||
		!gameInstructor ||
		!gameTeam ||
		!gameTeamPassword ||
		!gameController
	) {
		callback("/index.html?error=badRequest");
		return;
	}

	const gameTeamPasswordHashed = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	mysqlPool.query(
		"SELECT gameId, game0Password, game1Password, gameActive, ?? as commanderLogin FROM games WHERE gameSection = ? AND gameInstructor = ? ORDER BY gameId",
		[commanderLoginField, gameSection, gameInstructor],
		(error, results, fields) => {
			if (error) {
				callback("/index.html?error=database");
				return;
			}

			if (results.length != 1) {
				callback("/index.html?error=login");
				return;
			}

			const {
				gameId,
				game0Password,
				game1Password,
				gameActive,
				commanderLogin
			} = results[0];
			if (gameActive != 1) {
				callback("/index.html?error=gameNotActive");
				return;
			}
			if (commanderLogin != 0) {
				callback("/index.html?error=alreadyLoggedIn");
				return;
			}
			let gamePassword = game0Password;
			if (gameTeam == 1) {
				gamePassword = game1Password;
			}
			if (gameTeamPasswordHashed != gamePassword) {
				callback("/index.html?error=login");
				return;
			}

			mysqlPool.query(
				"UPDATE games SET ?? = 1 WHERE gameId = ?",
				[commanderLoginField, gameId],
				(error, results, fields) => {
					//handle error
					//shouldn't have error if succeeded above
				}
			);

			req.session.ir3 = {
				gameId: gameId,
				gameTeam: gameTeam,
				gameController: gameController
			};

			callback("/game.html");
			return;
		}
	);
};

exports.socketInitialGameState = (mysqlPool, socket) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	//SELECT based on TeamId (socket.handshake.session.ir3.gameTeam)
	//also consider gameController info in ir3

	const pointsField = `game${gameTeam}Points`;
	mysqlPool.query(
		"SELECT gameSection, gameInstructor, ?? as teamPoints FROM games WHERE gameId = ?",
		[pointsField, gameId],
		(error, results, fields) => {
			if (error) {
				socket.emit("serverRedirect", "database");
				return;
			}

			const teamPoints = results[0].teamPoints;

			mysqlPool.query(
				"SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?",
				[gameId, gameTeam],
				(error, results, fields) => {
					const shopItems = results;

					const { gameSection, gameInstructor } = results[0];
					const gameController = socket.handshake.session.ir3.gameController;

					const serverData = {
						type: INITIAL_GAMESTATE,
						payload: {
							points: teamPoints,
							userFeedback: "Welcome to Island Rush!!",
							gameInfo: {
								gameSection: gameSection,
								gameInstructor: gameInstructor,
								gameController: gameController
							},
							shopItems: shopItems,
							gameboard: [], //need to have all the positions in here...
							gameboardMeta: {
								selectedPosition: -1
							}
						}
					};

					socket.emit("serverSendingAction", serverData);
					return;
				}
			);
		}
	);
};

exports.shopPurchaseRequest = (mysqlPool, socket, shopItemTypeId) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//TODO: figure out if the purchase is allowed (game phase...controller Id....game active....)

	const pointsField = `game${gameTeam}Points`;

	mysqlPool.query(
		"SELECT ?? as points FROM games WHERE gameId = ?",
		[pointsField, gameId],
		(error, results, fields) => {
			const teamPoints = results[0].points;
			const shopItemCost = shopItemTypeCosts[shopItemTypeId];

			if (teamPoints >= shopItemCost) {
				mysqlPool.query(
					"UPDATE games SET ?? = ?? - ? WHERE gameId = ?",
					[pointsField, pointsField, shopItemCost, gameId],
					(error, results, fields) => {
						mysqlPool.query(
							"INSERT INTO shopItems (shopItemGameId, shopItemTeamId, shopItemTypeId) values (?, ?, ?)",
							[gameId, gameTeam, shopItemTypeId],
							(error, results, fields) => {
								const shopItem = {
									shopItemId: results.insertId,
									shopItemGameId: gameId,
									shopItemTeamId: gameTeam,
									shopItemTypeId: shopItemTypeId
								};

								const serverAction = {
									type: SHOP_PURCHASE,
									payload: {
										shopItem: shopItem
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
};

exports.shopRefundRequest = (mysqlPool, socket, shopItem) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//verify that the refund is available (correct controller, game active....)
	//verify that the piece exists and the object given matches database values (overkill)

	const pointsField = `game${gameTeam}Points`;
	const itemCost = shopItemTypeCosts[shopItem.shopItemTypeId];

	mysqlPool.query(
		"UPDATE games SET ?? = ?? + ? WHERE gameId = ?",
		[pointsField, pointsField, itemCost, gameId],
		(error, results, fields) => {
			//get rid of the item
			mysqlPool.query(
				"DELETE FROM shopItems WHERE shopItemId = ?",
				[shopItem.shopItemId],
				(error, results, fields) => {
					//probably check success of deletion?

					const serverAction = {
						type: SHOP_REFUND,
						payload: {
							shopItem: shopItem
						}
					};
					socket.emit("serverSendingAction", serverAction);
				}
			);
		}
	);
};
