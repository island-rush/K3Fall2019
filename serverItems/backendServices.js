//Libraries and Other External Code
const md5 = require("md5");
const fs = require("fs");

//Environment Constants
const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
const CourseDirectorPasswordHash =
	process.env.CD_PASSWORD || "912ec803b2ce49e4a541068d495ab570"; //"asdf"

//Other Constants
const {
	INITIAL_GAMESTATE,
	SHOP_PURCHASE,
	SHOP_REFUND,
	SET_USERFEEDBACK,
	SHOP_TRANSFER,
	shopItemTypeCosts,
	typeNameIds,
	typeMoves,
	typeFuel,
	PLAN_WAS_CONFIRMED,
	DELETE_PLAN,
	containerTypes,
	MAIN_BUTTON_CLICK,
	PURCHASE_PHASE,
	COMBAT_PHASE,
	PIECES_MOVE,
	SLICE_CHANGE,
	PLACE_PHASE,
	NEWS_PHASE,
	NEW_ROUND,
	visibilityMatrix,
	attackMatrix
} = require("./constants");

const distanceMatrix = require("./distanceMatrix");
const initialPieces = require("./initialPieces");
const initialNews = require("./initialNews");

//Database Pool
const pool = require("./database");

//Internal Functions
const getGameActiveReal = async (conn, gameId) => {
	const queryString = "SELECT gameActive FROM games WHERE gameId = ?";
	const inserts = [gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results[0]["gameActive"];
};

const gameDeleteReal = async (conn, gameId) => {
	let queryString = "DELETE FROM news WHERE newsGameId = ?";
	let inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM pieces WHERE pieceGameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM invItems WHERE invItemGameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM shopItems WHERE shopItemGameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM plans WHERE planGameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);

	queryString = "DELETE FROM games WHERE gameId = ?";
	inserts = [gameId];
	await conn.query(queryString, inserts);
};

const getGameId = async (conn, gameSection, gameInstructor) => {
	const queryString =
		"SELECT gameId FROM games WHERE gameSection = ? AND gameInstructor = ?";
	const inserts = [gameSection, gameInstructor];
	const [results, fields] = await conn.query(queryString, inserts);
	if (results.length === 1) {
		return results[0]["gameId"];
	} else {
		return null;
	}
};

const getGameInfo = async (conn, gameId) => {
	const queryString = "SELECT * FROM games WHERE gameId = ?";
	const inserts = [gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results[0];
};

const getPieceInfo = async (conn, pieceId) => {
	const queryString = "SELECT * FROM pieces WHERE pieceId = ?";
	const inserts = [pieceId];
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

const getTeamPlans = async (conn, gameId, gameTeam) => {
	const queryString =
		"SELECT * FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planPieceId, planMovementOrder ASC";
	const inserts = [gameId, gameTeam];
	const [results, fields] = await conn.query(queryString, inserts);

	let confirmedPlans = {};

	for (let x = 0; x < results.length; x++) {
		let { planPieceId, planPositionId, planSpecialFlag } = results[x];
		let type = planSpecialFlag === 0 ? "move" : "container"; //TODO: unknown future special flags could interfere

		if (!(planPieceId in confirmedPlans)) {
			confirmedPlans[planPieceId] = [];
		}

		confirmedPlans[planPieceId].push({
			type,
			positionId: planPositionId
		});
	}

	return confirmedPlans;
};

const logout = async socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3; //Assume we have this, if this method is ever called (from sockets)
	const loginField = "game" + gameTeam + "Controller" + gameController;
	const queryString = "UPDATE games SET ?? = 0 WHERE gameId = ?";
	const inserts = [loginField, gameId];
	try {
		await pool.query(queryString, inserts);
	} catch (error) {
		console.log(error);
		//nothing to send to client, they disconnected from the socket already...
	}
};

const giveInitialGameState = async socket => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const conn = await pool.getConnection();
	const gameInfo = await getGameInfo(conn, gameId);
	const invItems = await getTeamInvItems(conn, gameId, gameTeam);
	const shopItems = await getTeamShopItems(conn, gameId, gameTeam);
	const gameboardPieces = await getVisiblePieces(conn, gameId, gameTeam);
	const confirmedPlans = await getTeamPlans(conn, gameId, gameTeam);
	await conn.release();

	const {
		gameSection,
		gameInstructor,
		gamePhase,
		gameRound,
		gameSlice
	} = gameInfo;
	const gamePoints = gameInfo["game" + gameTeam + "Points"];
	const gameStatus = gameInfo["game" + gameTeam + "Status"];

	const serverAction = {
		type: INITIAL_GAMESTATE,
		payload: {
			gameInfo: {
				gameSection,
				gameInstructor,
				gameController,
				gamePhase,
				gameRound,
				gameSlice,
				gameStatus,
				gamePoints
			},
			shopItems,
			invItems,
			gameboardPieces,
			confirmedPlans
		}
	};

	socket.emit("serverSendingAction", serverAction);
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
	//TODO: could do client side checks until the confirm, and then go through 1 by 1 what was requested, checking points
	//this would be better than network request for each purchase (AND refund)...
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const shopItemCost = shopItemTypeCosts[shopItemTypeId];
	//TODO: figure out if the purchase is allowed (game phase...controller Id....game active....) (and in other methods...)

	const conn = await pool.getConnection();
	const gameInfo = await getGameInfo(conn, gameId);
	// const teamPoints = await getTeamPoints(conn, gameId, gameTeam);

	const { gameActive, gamePhase } = gameInfo;

	if (!gameActive) {
		await conn.release();
		return;
	}

	if (parseInt(gamePhase) !== 1) {
		await conn.release();
		socket.emit(
			"serverSendingAction",
			userFeedbackAction("Not the right phase...")
		);
		return;
	}

	if (parseInt(gameController) !== 0) {
		await conn.release();
		socket.emit(
			"serverSendingAction",
			userFeedbackAction("Not the right controller...")
		);
		return;
	}

	const teamPoints = gameInfo["game" + gameTeam + "Points"];

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
	//TODO: check that these session objects exist before using them
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const itemCost = shopItemTypeCosts[shopItem.shopItemTypeId];

	//TODO: verify that the refund is available (correct controller, game active....)
	//verify that the piece exists and the object given matches database values (overkill)

	const conn = await pool.getConnection();
	const teamPoints = await getTeamPoints(conn, gameId, gameTeam);
	const newPoints = teamPoints + itemCost;
	await setTeamPoints(conn, gameId, gameTeam, newPoints);
	await deleteShopItem(conn, shopItem.shopItemId);
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

	//TODO: verify if it is allowed, game active, phase, controller...

	const conn = await pool.getConnection();

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

const sendUserFeedback = async (socket, userFeedback) => {
	const serverAction = {
		type: SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const insertPlan = async (conn, pieceInfo, plan) => {
	const { pieceGameId, pieceTeamId, pieceId } = pieceInfo;
	for (let x = 0; x < plan.length; x++) {
		//movement order is x?
		let { positionId, type } = plan[x];
		let specialFlag = type === "move" ? 0 : 1; // 1 = container, use other numbers for future special flags...
		await conn.query(
			"INSERT INTO plans (planGameId, planTeamId, planPieceId, planMovementOrder, planPositionId, planSpecialFlag) VALUES (?, ?, ?, ?, ?, ?)",
			[pieceGameId, pieceTeamId, pieceId, x, positionId, specialFlag]
		);
	}
};

const confirmPlan = async (socket, pieceId, plan) => {
	//plan = moves array, where each move has type and positionId
	//confirm the plan and report back to the client with a server action
	//TODO: verify that this user is authorized to make a plan
	//verify that the piece exists?
	//verify that this piece belongs to this team? (all those other auths)
	//need to know if this piece is a container or not, to check if container move was inserted
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const conn = await pool.getConnection();
	const gameInfo = await getGameInfo(conn, gameId);
	const pieceInfo = await getPieceInfo(conn, pieceId);

	const { gameActive } = gameInfo;

	const {
		pieceGameId,
		pieceTeamId,
		piecePositionId,
		pieceContainerId,
		pieceTypeId
	} = pieceInfo;

	const isContainer = containerTypes.includes(pieceTypeId);

	//did the piece exists, same team as this one / same game...
	//make sure plan isnt empty...

	//can you do container to start the plan?

	let previousPosition = piecePositionId;

	for (let x = 0; x < plan.length; x++) {
		//make sure adjacency between positions in the plan...
		//other checks...piece type and number of moves?

		const { type, positionId } = plan[x];

		//make sure positions are equal for container type
		if (type == "container") {
			if (!isContainer) {
				sendUserFeedback(
					socket,
					"sent a bad plan, container move for non-container piece..."
				);
				return;
			}

			if (previousPosition != positionId) {
				sendUserFeedback(
					socket,
					"sent a bad plan, container move was not in previous position..."
				);
				return;
			}
		}

		if (distanceMatrix[previousPosition][positionId] !== 1) {
			if (type !== "container") {
				sendUserFeedback(
					socket,
					"sent a bad plan, positions were not adjacent..."
				);
				return;
			}
		}

		previousPosition = positionId;
	}

	//all of the plans checked out and were authorized
	//send the plan back to the client with confirm action

	//insert all of the plans into the database***
	await insertPlan(conn, pieceInfo, plan);

	await conn.release();

	const serverAction = {
		type: PLAN_WAS_CONFIRMED,
		payload: {
			pieceId,
			plan
		}
	};

	socket.emit("serverSendingAction", serverAction);
};

const deletePlan = async (socket, pieceId) => {
	//verify that the person is authorized to delete the plan (correct team, game, gameactive)
	//need lots of other checks in here for full security, assuming that they have a socket for whatever reason
	//could cut back the security checks for better performance...but not ideal

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const conn = await pool.getConnection();
	const gameInfo = await getGameInfo(conn, gameId);
	const pieceInfo = await getPieceInfo(conn, pieceId);

	//can still run the query if the plan doesn't exist? (it won't fail...)

	const queryString = "DELETE FROM plans WHERE planPieceId = ?";
	const inserts = [pieceId];
	await conn.query(queryString, inserts);

	await conn.release();

	const serverAction = {
		type: DELETE_PLAN,
		payload: {
			pieceId
		}
	};

	socket.emit("serverSendingAction", serverAction);
};

const getPieces = async (conn, gameId) => {
	const queryString = "SELECT * FROM pieces WHERE pieceGameId = ?";
	const inserts = [gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results;
};

// prettier-ignore
const getCollisionBattles = async (conn, gameId) => {
	let queryString = "SELECT * FROM (SELECT pieceId as pieceId0, pieceTypeId as pieceTypeId0, piecePositionId as piecePositionId0, planPositionId as planPositionId0 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 0 AND pieceGameId = ?) as a JOIN (SELECT pieceId as pieceId1, pieceTypeId as pieceTypeId1, piecePositionId as piecePositionId1, planPositionId as planPositionId1 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 1 AND pieceGameId = ?) as b ON piecePositionId0 = planPositionId1 AND planPositionId0 = piecePositionId1";
	let inserts = [gameId, gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results;
}

// prettier-ignore
const getPositionBattles = async (conn, gameId) => {
	let queryString = "SELECT * FROM (SELECT pieceId as pieceId0, piecePositionId as piecePositionId0, pieceTypeId as pieceTypeId0 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 0) as a JOIN (SELECT pieceId as pieceId1, piecePositionId as piecePositionId1, pieceTypeId as pieceTypeId1 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 1) as b ON piecePositionId0 = piecePositionId1";
	let inserts = [gameId, gameId];
	const [results, fields] = await conn.query(queryString, inserts);
	return results;
}

// prettier-ignore
const whatCanThisPieceSee = async (conn, gameId, pieceTeamId, pieceTypeId, piecePositionId) => {
	//loop through
	const thisPieceVisibility = visibilityMatrix[pieceTypeId];

	for (let x = 0; x < 20; x++) {
		if (thisPieceVisibility) {
			
		}
	}
}

const updateVisibility = async (conn, gameId) => {
	//need to update visibility for each piece based on the vision matrix...
	//what is the best way to determine visibiity for each piece
	//have the visibility matrix
	//loop for each piece and update a saved table for positions and what can be seen on them?
	//loop for each position and update other positions what can be seen on them based on pieces
	//loop for each piece and look outward for what can see it?

	const pieces = await getPieces(conn, gameId);

	for (let x = 0; x < pieces.length; x++) {
		//for each piece...
		let { pieceId, pieceTeamId, pieceTypeId, piecePositionId } = pieces[x];

		await whatCanThisPieceSee(
			conn,
			gameId,
			pieceTeamId,
			pieceTypeId,
			piecePositionId
		);
	}
};

const mainButtonClick = async (io, socket) => {
	//verify that this person is ok to click the button
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const conn = await pool.getConnection();
	const gameInfo = await getGameInfo(conn, gameId);
	const {
		gameActive,
		gamePhase,
		game0Status,
		game1Status,
		gameRound,
		gameSlice
	} = gameInfo;

	//need to do different things based on the phase?
	if (!gameActive) {
		await conn.release();
		return;
	}

	const thisTeamStatus = parseInt(gameTeam) === 0 ? game0Status : game1Status;
	const otherTeamStatus = parseInt(gameTeam) === 0 ? game1Status : game0Status;

	//thisTeamStatus == 1
	if (parseInt(thisTeamStatus) === 1) {
		//already pressed / already waiting
		await conn.release();
		socket.emit(
			"serverSendingAction",
			userFeedbackAction("Still waiting on other team...")
		);
		return;
	}

	if (parseInt(otherTeamStatus) === 0) {
		//other team still active, not yet ready to move on
		//mark this team as waiting

		let queryString = "UPDATE games set ?? = 1 WHERE gameId = ?";
		let inserts = ["game" + parseInt(gameTeam) + "Status", gameId];
		await conn.query(queryString, inserts);
		await conn.release();
		let serverAction = {
			type: MAIN_BUTTON_CLICK,
			payload: {}
		};
		socket.emit("serverSendingAction", serverAction);
		return;
	} else {
		//both teams done with this phase, round, slice, move...
		//mark other team as no longer waiting
		let queryString =
			"UPDATE games set game0Status = 0, game1Status = 0 WHERE gameId = ?";
		let inserts = [gameId];
		await conn.query(queryString, inserts);

		let serverAction;
		// let queryString;
		// let inserts;

		switch (parseInt(gamePhase)) {
			case 0:
				//news -> purchase
				queryString = "UPDATE games set gamePhase = 1 WHERE gameId = ?";
				inserts = [gameId];
				await conn.query(queryString, inserts);
				await conn.release();

				//let the everyone know stuff

				serverAction = {
					type: PURCHASE_PHASE,
					payload: {}
				};

				io.sockets
					.in("game" + gameId)
					.emit("serverSendingAction", serverAction);
				break;

			case 1:
				//purchase -> combat
				queryString = "UPDATE games set gamePhase = 2 WHERE gameId = ?";
				inserts = [gameId];
				await conn.query(queryString, inserts);
				await conn.release();

				//let the everyone know stuff

				serverAction = {
					type: COMBAT_PHASE,
					payload: {}
				};

				io.sockets
					.in("game" + gameId)
					.emit("serverSendingAction", serverAction);
				break;

			case 3:
				//place troops -> news phase
				queryString = "UPDATE games set gamePhase = 0 WHERE gameId = ?";
				inserts = [gameId];
				await conn.query(queryString, inserts);
				await conn.release();

				serverAction = {
					type: NEWS_PHASE,
					payload: {}
				};

				io.sockets
					.in("game" + gameId)
					.emit("serverSendingAction", serverAction);
				break;

			case 2:
				//combat phase controls (-> slice, -> execute/step, -> round++, -> place phase)
				if (parseInt(gameSlice) === 0) {
					//they are done making the plans for this round
					//change to slice === 1
					queryString = "UPDATE games SET gameSlice = 1 WHERE gameId = ?";
					inserts = [gameId];
					await conn.query(queryString, inserts);

					//need to let the clients know that done with planning, ready to execute
					serverAction = {
						type: SLICE_CHANGE,
						payload: {}
					};

					io.sockets
						.in("game" + gameId)
						.emit("serverSendingAction", serverAction);
					break;
				} else {
					// check for any events that exist prior to dealing with plans, execute events 1 by 1

					//TODO: need better standards for results, fields...usually do const, but continuing to use them (different names / numberings?)

					//get current movement order (for each team's plans)
					queryString =
						"SELECT planMovementOrder as currentMovementOrder FROM plans WHERE planGameId = ? AND planTeamId = 0 ORDER BY planMovementOrder ASC LIMIT 1";
					inserts = [gameId];
					let [results0, fields0] = await conn.query(queryString, inserts);

					queryString =
						"SELECT planMovementOrder as currentMovementOrder FROM plans WHERE planGameId = ? AND planTeamId = 1 ORDER BY planMovementOrder ASC LIMIT 1";
					inserts = [gameId];
					let [results1, fields1] = await conn.query(queryString, inserts);

					if (results0.length === 0 && results1.length === 0) {
						//both teams are done with plans
						if (gameRound === 2) {
							//move to place phase
							queryString =
								"UPDATE games SET gameRound = 0, gameSlice = 0, gamePhase = 3 WHERE gameId = ?";
							inserts = [gameId];
							await conn.query(queryString, inserts);

							serverAction = {
								type: PLACE_PHASE,
								payload: {}
							};

							io.sockets
								.in("game" + gameId)
								.emit("serverSendingAction", serverAction);
						} else {
							//move to next round
							queryString =
								"UPDATE games SET gameRound = gameRound + 1, gameSlice = 0 WHERE gameId = ?";
							inserts = [gameId];
							await conn.query(queryString, inserts);

							serverAction = {
								type: NEW_ROUND,
								payload: {
									gameRound: gameRound + 1
								}
							};

							io.sockets
								.in("game" + gameId)
								.emit("serverSendingAction", serverAction);
						}

						break;
					}

					let currentMovementOrder;

					//one of these should fire, since above check failed to exit
					//keeping the empty plan team at status1
					let game0StatusNew = 1;
					if (results0.length === 0) {
						queryString = "UPDATE games set game0Status = 1 WHERE gameId = ?";
						inserts = [gameId];
						await conn.query(queryString, inserts);
					} else {
						currentMovementOrder = results0[0]["currentMovementOrder"];
						game0StatusNew = 0;
					}

					let game1StatusNew = 1;
					if (results1.length === 0) {
						queryString = "UPDATE games set game1Status = 1 WHERE gameId = ?";
						inserts = [gameId];
						await conn.query(queryString, inserts);
					} else {
						currentMovementOrder = results1[0]["currentMovementOrder"];
						game1StatusNew = 0;
					}

					// check for collision battles
					const allCollisionBattles = await getCollisionBattles(conn, gameId);

					if (allCollisionBattles.length > 0) {
						//filter through each collision battle and create events for it
						//multiple pieces colliding -> same event...
						//event has a touple identifier? (collision between x,y)
					}

					// create collision battle events
					// signal that these need to happen (in database)
					// break if inserted events, continue if no events necessary (send client first event?)

					//moving the pieces (non-special flag)
					queryString =
						"UPDATE pieces, plans SET pieces.piecePositionId = plans.planPositionId WHERE pieces.pieceId = plans.planPieceId AND planGameId = ? AND plans.planMovementOrder = ? AND plans.planSpecialFlag = 0";
					inserts = [gameId, currentMovementOrder];
					await conn.query(queryString, inserts);

					//delete those plans (non-special flag)
					queryString =
						"DELETE FROM plans WHERE planGameId = ? AND planMovementOrder = ? AND planSpecialFlag = 0";
					inserts = [gameId, currentMovementOrder];
					await conn.query(queryString, inserts);

					// create battle events

					const allPositionBattles = await getPositionBattles(conn, gameId);

					if (allPositionBattles.length > 0) {
						//filter through each position battle and create events for it
						//multiple pieces in same position -> same event
						//event has 1 identifier (position battle at x)
					}

					// where blue pieces same position as red pieces... (and other information)
					// create refuel events (special flag? / proximity) (check to see that the piece still exists!*!*)
					// create container events (special flag)
					// update visibility (algorithm)

					await updateVisibility(conn, gameId);

					//create final update to each client
					const server0Action = {
						type: PIECES_MOVE,
						payload: {
							gameboardPieces: await getVisiblePieces(conn, gameId, 0),
							gameStatus: game0StatusNew
						}
					};

					const server1Action = {
						type: PIECES_MOVE,
						payload: {
							gameboardPieces: await getVisiblePieces(conn, gameId, 1),
							gameStatus: game1StatusNew
						}
					};

					//send final update to each client
					io.sockets
						.in("game" + gameId + "team0")
						.emit("serverSendingAction", server0Action);
					io.sockets
						.in("game" + gameId + "team1")
						.emit("serverSendingAction", server1Action);
				}

				break;
			default:
				socket.emit(
					"serverSendingAction",
					userFeedbackAction("Backend Failure, unkown gamePhase...")
				);
		}

		await conn.release();
		return;
	}
};

const userFeedbackAction = userFeedback => {
	return {
		type: SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
};

//Exposed / Exported Functions
exports.gameReset = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.status(403).redirect("/index.html?error=access");
		return;
	}

	const { gameId } = req.session.ir3;

	try {
		const conn = await pool.getConnection();
		const gameInfo = await getGameInfo(conn, gameId);
		const { gameSection, gameInstructor, gameAdminPassword } = gameInfo;

		await gameDeleteReal(conn, gameId);

		let queryString =
			"INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?, ?)";
		let inserts = [gameId, gameSection, gameInstructor, gameAdminPassword];
		await conn.query(queryString, inserts);

		await initialPieces(conn, gameId);
		await initialNews(conn, gameId);

		conn.release();

		res.redirect("/teacher.html?gameReset=success");
	} catch (error) {
		console.log(error);
		res.status(500).redirect("/teacher.html?gameReset=failed");
	}
};

exports.adminLoginVerify = async (req, res) => {
	const { adminSection, adminInstructor, adminPassword } = req.body;

	if (!adminSection || !adminInstructor || !adminPassword) {
		res.redirect("/index.html?error=badRequest");
		return;
	}

	const inputPasswordHash = md5(adminPassword);
	if (
		adminSection == "CourseDirector" &&
		adminInstructor == CourseDirectorLastName &&
		inputPasswordHash == CourseDirectorPasswordHash
	) {
		req.session.ir3 = { courseDirector: true };
		res.redirect("/courseDirector.html");
		return;
	}

	try {
		const conn = await pool.getConnection();
		const gameId = await getGameId(conn, adminSection, adminInstructor);

		if (!gameId) {
			res.redirect("/index.html?error=login");
			conn.release();
			return;
		}

		const gameInfo = await getGameInfo(conn, gameId);
		conn.release();

		if (gameInfo["gameAdminPassword"] != inputPasswordHash) {
			res.redirect("/index.html?error=login");
			return;
		}

		req.session.ir3 = {
			gameId: gameId,
			teacher: true,
			adminSection, //same name = don't need : inside the object...
			adminInstructor
		};
		res.redirect(`/teacher.html`);
		return;
	} catch (error) {
		console.log(error);
		res.status(500).redirect("/index.html?error=database");
	}
};

exports.gameLoginVerify = async (req, res, callback) => {
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
		res.redirect("/index.html?error=badRequest");
		return;
	}

	const inputPasswordHash = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password

	try {
		const conn = await pool.getConnection();
		const gameId = await getGameId(conn, gameSection, gameInstructor);

		if (!gameId) {
			conn.release();
			res.redirect("/index.html?error=login");
			return;
		}

		const gameInfo = await getGameInfo(conn, gameId);

		if (gameInfo["gameActive"] != 1) {
			res.redirect("/index.html?error=gameNotActive");
		} else if (gameInfo[commanderLoginField] != 0) {
			res.redirect("/index.html?error=alreadyLoggedIn");
		} else if (inputPasswordHash != gameInfo[passwordHashToCheck]) {
			res.redirect("/index.html?error=login");
		} else {
			await markLoggedIn(conn, gameId, commanderLoginField);

			req.session.ir3 = {
				gameId: gameId,
				gameTeam: gameTeam,
				gameController: gameController
			};

			res.redirect("/game.html");
		}

		conn.release();
	} catch (error) {
		console.log(error);
		res.status(500).redirect("./index.html?error=database");
	}
};

exports.getGames = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect("/index.html?error=access");
		return;
	}

	try {
		const queryString =
			"SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
		const [results, fields] = await pool.query(queryString);
		res.send(results);
	} catch (error) {
		// console.log(error);  // This error occurs for the course director before he initializes the database
		res.status(500).send([
			{
				gameId: 69,
				gameSection: "DATABASE",
				gameInstructor: "FAILED",
				gameActive: 0
			}
		]);
	}
};

exports.getGameActive = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.sendStatus(403);
		return;
	}

	const { gameId } = req.session.ir3;

	try {
		const conn = await pool.getConnection();
		const gameActive = await getGameActiveReal(conn, gameId);
		conn.release();
		res.send(JSON.stringify(gameActive));
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

exports.databaseStatus = async (req, res) => {
	try {
		const conn = await pool.getConnection();
		res.send("Connected");
		conn.release();
	} catch (error) {
		console.log(error);
		res.status(500).send(error.code);
	}
};

exports.toggleGameActive = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.sendStatus(403);
		return;
	}

	const { gameId } = req.session.ir3;

	try {
		const queryString =
			"UPDATE games SET gameActive = (gameActive + 1) % 2, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?";
		const inserts = [gameId];
		await pool.query(queryString, inserts);
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
};

exports.insertDatabaseTables = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect("/index.html?error=access");
		return;
	}

	try {
		const queryString = fs
			.readFileSync("./serverItems/sqlScripts/tableInsert.sql")
			.toString();
		await pool.query(queryString);
		res.redirect("/courseDirector.html?initializeDatabase=success");
	} catch (error) {
		console.log(error);
		res.redirect("/courseDirector.html?initializeDatabase=failed");
	}
};

exports.gameAdd = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(403, "/index.html?error=access");
		return;
	}

	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		//TODO: better errors on CD (could have same as index) (status?)
		res.redirect("/index.html?error=badRequest");
		return;
	}

	try {
		const adminPasswordHashed = md5(adminPassword);
		const queryString =
			"INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)";
		const inserts = [adminSection, adminInstructor, adminPasswordHashed];
		await pool.query(queryString, inserts);
		res.redirect("/courseDirector.html?gameAdd=success");
	} catch (error) {
		//TODO: better error logging probably (more specific errors on CD) (on other functions too)
		console.log(error);
		res.redirect(500, "/courseDirector.html?gameAdd=failed");
	}
};

exports.gameDelete = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.status(403).redirect("/index.html?error=access");
		return;
	}

	const { gameId } = req.body;
	if (!gameId) {
		res.status(400).redirect("/courseDirector.html?gameDelete=failed");
		return;
	}

	try {
		const conn = await pool.getConnection();
		await gameDeleteReal(conn, gameId);
		conn.release();
		res.redirect("/courseDirector.html?gameDelete=success");
	} catch (error) {
		console.log(error);
		res.status(500).redirect("/courseDirector.html?gameDelete=failed");
	}
};

exports.socketSetup = (io, socket) => {
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

	//Room for the Game
	socket.join("game" + gameId);

	//Room for the Team
	socket.join("game" + gameId + "team" + gameTeam);

	//Room for the Indiviual Controller
	socket.join(
		"game" + gameId + "team" + gameTeam + "controller" + gameController
	);

	//TODO: Server Side Rendering with react?
	giveInitialGameState(socket);

	//TODO: reflect that the argument is a payload, change these to be objects that the server is receiving for continuity
	socket.on("shopPurchaseRequest", shopItemTypeId => {
		try {
			shopPurchaseRequest(socket, shopItemTypeId);
		} catch (error) {
			console.log(error);
			socket.emit(
				"serverSendingAction",
				userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE")
			);
		}
	});

	socket.on("shopRefundRequest", shopItem => {
		try {
			shopRefundRequest(socket, shopItem);
		} catch (error) {
			console.log(error);
			socket.emit(
				"serverSendingAction",
				userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE")
			);
		}
	});

	socket.on("shopConfirmPurchase", () => {
		try {
			shopConfirmPurchase(socket);
		} catch (error) {
			console.log(error);
			socket.emit(
				"serverSendingAction",
				userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE")
			);
		}
	});

	socket.on("confirmPlan", payload => {
		const { pieceId, plan } = payload;

		try {
			confirmPlan(socket, pieceId, plan);
		} catch (error) {
			console.log(error);
			socket.emit(
				"serverSendingAction",
				userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE")
			);
		}
	});

	socket.on("deletePlan", payload => {
		const { pieceId } = payload;

		try {
			deletePlan(socket, pieceId);
		} catch (error) {
			console.log(error);
			socket.emit(
				"serverSendingAction",
				userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE")
			);
		}
	});

	socket.on("mainButtonClick", () => {
		try {
			mainButtonClick(io, socket);
		} catch (error) {
			console.log(error);
			socket.emit(
				"serverSendingAction",
				userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE")
			);
		}
	});

	socket.on("disconnect", () => {
		//TODO: do try catch at this level instead of within the specific function
		logout(socket);
	});
};
