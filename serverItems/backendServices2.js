const md5 = require("md5");
const fs = require("fs");
const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
const CourseDirectorPasswordHash =
	process.env.CD_PASSWORD || "912ec803b2ce49e4a541068d495ab570"; //"asdf"

const {
	INITIAL_GAMESTATE,
	SHOP_PURCHASE,
	SHOP_REFUND,
	SET_USERFEEDBACK,
	SHOP_TRANSFER,
	shopItemTypeCosts,
	typeNameIds,
	typeMoves,
	typeFuel
} = require("./constants");

const promisePool = require("./database").promise();

exports.adminLoginVerify = async (req, callback) => {
	const { adminSection, adminInstructor, adminPassword } = req.body;

	if (!adminSection || !adminInstructor || !adminPassword) {
		callback("/index.html?error=badRequest");
		return;
	}

	const inputPasswordHash = md5(adminPassword);
	if (
		adminSection == "CourseDirector" &&
		adminInstructor == CourseDirectorLastName &&
		inputPasswordHash == CourseDirectorPasswordHash
	) {
		req.session.ir3 = { courseDirector: true };
		callback("/courseDirector.html");
		return;
	}

	const conn = await promisePool.getConnection();
	const gameId = await getGameId(conn, adminSection, adminInstructor);
	const gameInfo = await getGameInfo(conn, gameId);
	conn.release();

	if (gameInfo["gameAdminPassword"] != inputPasswordHash) {
		callback("/index.html?error=login");
		return;
	}

	req.session.ir3 = {
		gameId: gameId,
		teacher: true,
		adminSection, //same name = don't need : inside the object...
		adminInstructor
	};
	callback(`/teacher.html`);
	return;
};

exports.gameLoginVerify = async (req, callback) => {
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

	const inputPasswordHash = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password

	const conn = await promisePool.getConnection();
	const gameId = await getGameId(conn, gameSection, gameInstructor);
	const gameInfo = await getGameInfo(conn, gameId);

	if (gameInfo["gameActive"] != 1) {
		callback("/index.html?error=gameNotActive");
	} else if (gameInfo[commanderLoginField] != 0) {
		callback("/index.html?error=alreadyLoggedIn");
	} else if (inputPasswordHash != gameInfo[passwordHashToCheck]) {
		callback("/index.html?error=login");
	} else {
		await markLoggedIn(conn, gameId, commanderLoginField);

		req.session.ir3 = {
			gameId: gameId,
			gameTeam: gameTeam,
			gameController: gameController
		};

		callback("/game.html");
	}

	conn.release();
};

exports.getGames = async (req, callback) => {
	try {
		const queryString =
			"SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
		const [results, fields] = await promisePool.query(queryString);
		callback(results);
	} catch (error) {
		callback([]);
	}
};

exports.getGameActive = async (req, callback) => {
	const { gameId } = req.session.ir3;
	const conn = await promisePool.getConnection();
	const gameActive = await getGameActiveReal(conn, gameId);
	await conn.release();
	callback(gameActive);
};

const getGameActiveReal = async (conn, gameId) => {
	const queryString = "SELECT gameActive FROM games WHERE gameId = ?";
	const inserts = [gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results[0]["gameActive"];
};

exports.gameAdd = async (req, callback) => {
	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		callback(false);
		return;
	}
	const adminPasswordHashed = md5(adminPassword);
	const queryString =
		"INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)";
	const inserts = [adminSection, adminInstructor, adminPasswordHashed];
	await promisePool.query(queryString, inserts);
	callback(true);
};

exports.gameDelete = async (req, callback) => {
	const { gameId } = req.body;
	if (!gameId) {
		callback(false);
		return;
	}

	const conn = await promisePool.getConnection();

	await gameDeleteReal(conn, gameId);

	await conn.release();

	callback(true);
};

const gameDeleteReal = async (conn, gameId) => {
	let queryString = "DELETE FROM pieces WHERE pieceGameId = ?";
	let inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM invItems WHERE invItemGameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM shopItems WHERE shopItemGameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM games WHERE gameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);
};

exports.databaseStatus = async (req, callback) => {
	try {
		const conn = await promisePool.getConnection();
		if (conn) {
			callback(true);
			await conn.release();
		} else {
			callback(false);
		}
	} catch (error) {
		callback(false);
	}
};

exports.toggleGameActive = async (req, callback) => {
	const { gameId } = req.session.ir3;
	const queryString =
		"UPDATE games SET gameActive = (gameActive + 1) % 2, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?";
	const inserts = [gameId];
	await promisePool.query(queryString, inserts);
	callback();
};

exports.insertDatabaseTables = async (req, callback) => {
	try {
		const queryString = fs
			.readFileSync("./serverItems/sqlScripts/tableInsert.sql")
			.toString();
		await promisePool.query(queryString);
		callback("success");
	} catch (error) {
		callback("failed");
	}
};

const getGameId = async (conn, gameSection, gameInstructor) => {
	const queryString =
		"SELECT gameId FROM games WHERE gameSection = ? AND gameInstructor = ?";
	const inserts = [gameSection, gameInstructor];
	const [results, fields] = await conn.query(queryString, inserts);
	return results[0]["gameId"];
};

const getGameInfo = async (conn, gameId) => {
	const queryString = "SELECT * FROM games WHERE gameId = ?";
	const inserts = [gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results[0];
};

const markLoggedIn = async (conn, gameId, commanderField) => {
	const queryString = "UPDATE games SET ?? = 1 WHERE gameId = ?";
	const inserts = [commanderField, gameId];
	await conn.query(queryString, inserts); //TODO: do we need to await if this is run and forget? (don't want to release early?)
};

const getVisiblePieces = async (conn, gameId, gameTeam) => {
	const queryString =
		"SELECT * FROM pieces WHERE pieceGameId = ? AND (pieceTeamId = ? OR pieceVisible = 1) ORDER BY pieceContainerId, pieceTeamId ASC";
	const inserts = [gameId, gameTeam];
	const [results, fields] = await conn.query(queryString, inserts);

	let allPieces = {};
	for (let x = 0; x < results.length; x++) {
		let currentPiece = results[x];
		currentPiece.pieceContents = { pieces: [] };
		if (!allPieces[currentPiece.piecePositionId]) {
			allPieces[currentPiece.piecePositionId] = [];
		}
		if (currentPiece.pieceContainerId === -1) {
			allPieces[currentPiece.piecePositionId].push(currentPiece);
		} else {
			let indexOfParent = allPieces[currentPiece.piecePositionId].findIndex(
				piece => {
					return piece.pieceId === currentPiece.pieceContainerId;
				}
			);
			allPieces[currentPiece.piecePositionId][indexOfParent].pieceContents.push(
				currentPiece
			);
		}
	}

	return allPieces;
};

const getTeamInvItems = async (conn, gameId, gameTeam) => {
	const queryString =
		"SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
	const inserts = [gameId, gameTeam];
	const [results, fields] = await conn.query(queryString, inserts);
	return results;
};

const getTeamShopItems = async (conn, gameId, gameTeam) => {
	const queryString =
		"SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
	const inserts = [gameId, gameTeam];
	const [results, fields] = await conn.query(queryString, inserts);
	return results;
};

const logout = async socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const loginField = "game" + gameTeam + "Controller" + gameController;
	const queryString = "UPDATE games SET ?? = 0 WHERE gameId = ?";
	const inserts = [loginField, gameId];
	await promisePool.query(queryString, inserts);
};

const giveInitialGameState = async socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const conn = await promisePool.getConnection();
	const gameInfo = await getGameInfo(conn, gameId);
	const invItems = await getTeamInvItems(conn, gameId, gameTeam);
	const shopItems = await getTeamShopItems(conn, gameId, gameTeam);
	const gameboardPieces = await getVisiblePieces(conn, gameId, gameTeam);
	await conn.release();

	const { gameSection, gameInstructor } = gameInfo;
	const teamPoints = gameInfo["game" + gameTeam + "Points"];

	const serverAction = {
		type: INITIAL_GAMESTATE,
		payload: {
			gameInfo: {
				gameSection,
				gameInstructor,
				gameController,
				gamePoints: teamPoints
			},
			shopItems,
			invItems,
			gameboardPieces
		}
	};

	socket.emit("serverSendingAction", serverAction);
};

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
	// socket.join("game" + gameId + "team" + gameTeam);

	//Room for the Indiviual Controller
	// socket.join(
	// 	"game" + gameId + "team" + gameTeam + "controller" + gameController
	// );

	//Send the initial game state (TODO: Server Side Rendering with react?)
	giveInitialGameState(socket);

	socket.on("shopPurchaseRequest", shopItemTypeId => {
		shopPurchaseRequest(socket, shopItemTypeId);
	});

	socket.on("shopRefundRequest", shopItem => {
		shopRefundRequest(socket, shopItem);
	});

	socket.on("shopConfirmPurchase", () => {
		shopConfirmPurchase(socket);
	});

	socket.on("disconnect", async () => {
		//TODO: error handle if session isn't there?
		try {
			await logout(socket);
		} catch (error) {
			console.log(error);
			console.log("logout error");
		}
	});
};

const getTeamPoints = async (conn, gameId, gameTeam) => {
	const pointsField = "game" + gameTeam + "Points";
	const queryString = "SELECT ?? as teamPoints from games WHERE gameId = ?";
	const inserts = [pointsField, gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	const teamPoints = results[0]["teamPoints"];
	return teamPoints;
};

const setTeamPoints = async (conn, gameId, gameTeam, newPoints) => {
	const pointsField = "game" + gameTeam + "Points";
	const queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
	const inserts = [pointsField, newPoints, gameId];
	await conn.query(queryString, inserts);
};

const insertShopItem = async (conn, gameId, gameTeam, shopItemTypeId) => {
	const queryString =
		"INSERT INTO shopItems (shopItemGameId, shopItemTeamId, shopItemTypeId) values (?, ?, ?)";
	const inserts = [gameId, gameTeam, shopItemTypeId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results.insertId;
};

const shopPurchaseRequest = async (socket, shopItemTypeId) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const shopItemCost = shopItemCosts[shopItemTypeId];
	//TODO: figure out if the purchase is allowed (game phase...controller Id....game active....)

	const conn = await promisePool.getConnection();
	const teamPoints = await getTeamPoints(conn, gameId, gameTeam);

	if (teamPoints < shopItemCost) {
		await conn.release();
		const serverAction = {
			type: SET_USERFEEDBACK,
			payload: {
				userFeedback: "Not enough points to purchase"
			}
		};
		socket.emit("serverSendingAction", serverAction);
		return;
	}

	const newPoints = teamPoints - shopItemCost;
	await setTeamPoints(conn, gameId, gameTeam, newPoints);
	const shopItemId = await insertShopItem(
		conn,
		gameId,
		gameTeam,
		shopItemTypeId
	);

	await conn.release();

	const shopItem = {
		shopItemId,
		shopItemGameId: gameId,
		shopItemTeamId: gameTeam,
		shopItemTypeId: shopItemTypeId
	};

	const serverAction = {
		type: SHOP_PURCHASE,
		payload: {
			shopItem: shopItem,
			points: newPoints
		}
	};
	socket.emit("serverSendingAction", serverAction);
	return;
};

const deleteShopItem = async (conn, shopItemId) => {
	const queryString = "DELETE FROM shopItems WHERE shopItemId = ?";
	const inserts = [shopItemId];
	await conn.query(queryString, inserts);
};

const shopRefundRequest = async (socket, shopItem) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const itemCost = shopItemTypeCosts[shopItem.shopItemTypeId];

	//TODO: verify that the refund is available (correct controller, game active....)
	//verify that the piece exists and the object given matches database values (overkill)

	const conn = await promisePool.getConnection();
	const teamPoints = await getTeamPoints(conn, gameId, gameTeam);
	const newPoints = teamPoints + itemCost;
	await setTeamPoints(conn, gameId, gameTeam, newPoints);
	await deleteShopItem(conn, shopItemId);
	await conn.release();

	const serverAction = {
		type: SHOP_REFUND,
		payload: {
			shopItem: shopItem,
			pointsAdded: itemCost
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const shopConfirmPurchase = async socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//verify if it is allowed, game active, phase, controller...

	const conn = await promisePool.getConnection();

	let queryString =
		"INSERT INTO invItems (invItemId, invItemGameId, invItemTeamId, invItemTypeId) SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
	let inserts = [gameId, gameTeam];
	await conn.query(queryString, inserts);

	queryString =
		"DELETE FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
	inserts = [gameId, gameTeam];
	await conn.query(queryString, inserts);

	queryString =
		"SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
	inserts = [gameId, gameTeam];
	const [results, fields] = await conn.query(queryString, inserts);

	await conn.release();

	const serverAction = {
		type: SHOP_TRANSFER,
		payload: {
			invItems: results
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const piece = (
	pieceGameId,
	pieceTeamName,
	pieceTypeName,
	piecePositionId,
	pieceContainerId = -1,
	pieceVisible = 1
) => {
	const pieceTeamId = pieceTeamName === "Blue" ? 0 : 1;
	const pieceTypeId = typeNameIds[pieceTypeName];
	const pieceMoves = typeMoves[pieceTypeId];
	const pieceFuel = typeFuel[pieceTypeId];
	return [
		pieceGameId,
		pieceTeamId,
		pieceTypeId,
		piecePositionId,
		pieceContainerId,
		pieceVisible,
		pieceMoves,
		pieceFuel
	];
};

const generateDefaultPieceValues = gameId => {
	return [
		piece(gameId, "Blue", "Tank", 0),
		piece(gameId, "Blue", "Plane", 0),
		piece(gameId, "Red", "Tank", 0),
		piece(gameId, "Red", "Plane", 0),
		piece(gameId, "Blue", "Tank", 1),
		piece(gameId, "Red", "Radar", 2),
		piece(gameId, "Red", "Sub", 2),
		piece(gameId, "Red", "Plane", 2),
		piece(gameId, "Red", "Transport", 2),
		piece(gameId, "Blue", "Tank", 3)
	];
};

exports.gameReset2 = async (req, callback) => {
	try {
		const { gameId } = req.session.ir3;
		const conn = await promisePool.getConnection();
		const gameInfo = await getGameInfo(conn, gameId);
		const { gameSection, gameInstructor, gameAdminPassword } = gameInfo;

		await gameDeleteReal(conn, gameId);

		let queryString =
			"INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?, ?)";
		let inserts = [gameId, gameSection, gameInstructor, gameAdminPassword];
		await conn.query(queryString, inserts);

		queryString =
			"INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?";
		defaultPieceValues = generateDefaultPieceValues(gameId);
		inserts = [defaultPieceValues];
		await conn.query(queryString, inserts);

		await conn.release();

		callback(true);
	} catch (error) {
		console.log(error);
		callback(false);
	}
};
