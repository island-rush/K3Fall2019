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

exports.gameAdd = (req, callback) => {
	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		callback(false);
		return;
	}

	const adminPasswordHashed = md5(adminPassword);
	pool.query(
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

exports.gameDelete = (req, callback) => {
	const { gameId } = req.body;
	if (!gameId) {
		callback(false);
		return;
	}

	//TODO: delete all the other tables...

	pool.query(
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

exports.databaseStatus = (req, callback) => {
	pool.getConnection((err, connection) => {
		if (err) {
			callback(false);
		} else {
			callback(true);
			connection.release();
		}
	});
};

exports.getGames = (req, callback) => {
	pool.query("SELECT * FROM games", (error, results, fields) => {
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

exports.adminLoginVerify = (req, callback) => {
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

	pool.query(
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
				teacher: true,
				adminSection, //same name = don't need :
				adminInstructor
			};
			callback(`/teacher.html`);
			return;
		}
	);
};

exports.getGameActive = (req, callback) => {
	const { gameId } = req.session.ir3;
	pool.query(
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

exports.toggleGameActive = (req, callback) => {
	const { gameId } = req.session.ir3;
	pool.query(
		"UPDATE games SET gameActive = (gameActive + 1) % 2, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?",
		[gameId],
		(error, results, fields) => {
			//handle error (callback does not depend on success TODO: notify of failure?)
			callback();
			return;
		}
	);
};

exports.insertDatabaseTables = (req, callback) => {
	// const sqlthing = require('./sqlScripts/t')
	const sql = fs.readFileSync("./sqlScripts/tableInsert.sql").toString();
	pool.query(sql, (error, results, fields) => {
		if (error) {
			callback("failed");
			return;
		} else {
			callback("success");
			return;
		}
	});
};

exports.gameLoginVerify = (req, callback) => {
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
	pool.getConnection((error, connection) => {
		connection.query(
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

				connection.query(
					"UPDATE games SET ?? = 1 WHERE gameId = ?",
					[commanderLoginField, gameId],
					(error, results, fields) => {
						//handle error
						//shouldn't have error if succeeded above
						connection.release();

						req.session.ir3 = {
							gameId: gameId,
							gameTeam: gameTeam,
							gameController: gameController
						};

						callback("/game.html");
						return;
					}
				);
			}
		);
	});
};

const getInitialGameState = socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	//SELECT based on TeamId (socket.handshake.session.ir3.gameTeam)
	//also consider gameController info in ir3

	const pointsField = `game${gameTeam}Points`;

	pool.getConnection((error, connection) => {
		if (error) throw error; //deal with error
		connection.query(
			"SELECT gameSection, gameInstructor, ?? as teamPoints FROM games WHERE gameId = ?",
			[pointsField, gameId],
			(error, results, fields) => {
				if (error) {
					socket.emit("serverRedirect", "database");
					return;
				}
				const { gameSection, gameInstructor } = results[0];
				const teamPoints = results[0].teamPoints;
				connection.query(
					"SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?",
					[gameId, gameTeam],
					(error, results, fields) => {
						const shopItems = results;

						connection.query(
							"SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?",
							[gameId, gameTeam],
							(error, results, fields) => {
								const invItems = results;
								connection.query(
									"SELECT * FROM pieces WHERE pieceGameId = ? AND (pieceTeamId = ? OR pieceVisible = 1) ORDER BY pieceContainerId, pieceTeamId ASC",
									[gameId, gameTeam],
									(error, results, fields) => {
										connection.release();

										let allPieces = {};

										for (let x = 0; x < results.length; x++) {
											let currentPiece = results[x];
											currentPiece.pieceContents = { pieces: [] };
											if (!allPieces[currentPiece.piecePositionId]) {
												allPieces[currentPiece.piecePositionId] = [];
											}
											if (currentPiece.pieceContainerId === -1) {
												allPieces[currentPiece.piecePositionId].push(
													currentPiece
												);
											} else {
												let indexOfParent = allPieces[
													currentPiece.piecePositionId
												].findIndex(piece => {
													return (
														piece.pieceId === currentPiece.pieceContainerId
													);
												});
												allPieces[currentPiece.piecePositionId][
													indexOfParent
												].pieceContents.push(currentPiece);
											}
										}

										const serverAction = {
											type: INITIAL_GAMESTATE,
											payload: {
												points: teamPoints,
												gameInfo: {
													gameSection: gameSection,
													gameInstructor: gameInstructor,
													gameController: gameController,
													gamePoints: teamPoints
												},
												shopItems: shopItems,
												invItems: invItems,
												gameboardPieces: allPieces, //need to insert the pieces from the db
												gameboardMeta: {
													selectedPosition: -1
												}
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
			}
		);
	});
};

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

exports.socketSetup = socket => {
	if (
		!socket.handshake.session.ir3 ||
		!socket.handshake.session.ir3.gameId ||
		!socket.handshake.session.ir3.gameTeam ||
		!socket.handshake.session.ir3.gameController
	) {
		socket.emit("serverRedirect", "access");
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Room for the Team
	socket.join("game" + gameId + "team" + gameTeam);

	//Room for the Indiviual Controller
	socket.join(
		"game" + gameId + "team" + gameTeam + "controller" + gameController
	);

	//Send the initial game state (TODO: Server Side Rendering with react?)
	getInitialGameState(socket);

	socket.on("shopPurchaseRequest", shopItemTypeId => {
		shopPurchaseRequest(socket, shopItemTypeId);
	});

	socket.on("shopRefundRequest", shopItem => {
		shopRefundRequest(socket, shopItem);
	});

	socket.on("shopConfirmPurchase", () => {
		shopConfirmPurchase(socket);
	});

	socket.on("disconnect", () => {
		logout(socket);
	});
};

exports.gameReset = (req, callback) =>
	require("./gameReset").gameReset(req, callback, pool);
