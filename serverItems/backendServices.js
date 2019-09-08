//Libraries and Other External Code
const md5 = require("md5");
const fs = require("fs");

//Environment Constants
const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
const CourseDirectorPasswordHash = process.env.CD_PASSWORD || "912ec803b2ce49e4a541068d495ab570"; //"asdf"

//Other Constants
const {
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

//Database Pool
const pool = require("./database");

//OOP Attempt to cleanup this file
const { Game, ShopItem, InvItem, Piece, Plan, Event } = require("./classes");

//Internal Functions
const shopPurchaseRequest = async (socket, shopItemTypeId) => {
	//TODO: could do client side checks until the confirm, and then go through 1 by 1 what was requested, checking points
	//this would be better than network request for each purchase (AND refund)...
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const shopItemCost = shopItemTypeCosts[shopItemTypeId];
	//TODO: figure out if the purchase is allowed (game phase...controller Id....game active....) (and in other methods...)

	const thisGame = new Game({ gameId });
	await thisGame.init();

	const { gameActive, gamePhase } = thisGame;

	if (!gameActive) {
		return;
	}

	if (parseInt(gamePhase) !== 1) {
		socket.emit("serverSendingAction", userFeedbackAction("Not the right phase..."));
		return;
	}

	if (parseInt(gameController) !== 0) {
		socket.emit("serverSendingAction", userFeedbackAction("Not the right controller..."));
		return;
	}

	const teamPoints = thisGame["game" + gameTeam + "Points"];

	if (teamPoints < shopItemCost) {
		socket.emit("serverSendingAction", userFeedbackAction("Not enough points to purchase"));
		return;
	}

	const points = teamPoints - shopItemCost;
	await thisGame.setPoints(gameTeam, points);

	const shopItem = await ShopItem.insert(gameId, gameTeam, shopItemTypeId);

	const serverAction = {
		type: SHOP_PURCHASE,
		payload: {
			shopItem,
			points
		}
	};
	socket.emit("serverSendingAction", serverAction);
	return;
};

const shopRefundRequest = async (socket, shopItem) => {
	//TODO: check that these session objects exist before using them
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const itemCost = shopItemTypeCosts[shopItem.shopItemTypeId];

	const thisGame = new Game({ gameId });
	await thisGame.init();

	const teamPoints = thisGame["game" + gameTeam + "Points"];

	//TODO: verify that the refund is available (correct controller, game active....)
	//verify that the piece exists and the object given matches database values (overkill)

	const newPoints = teamPoints + itemCost;
	await thisGame.setPoints(gameTeam, newPoints);
	await ShopItem.delete(shopItem.shopItemId);

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
	//could extra verify that purchases were allowed? but redundant since these are already in the database

	await InvItem.insertFromShop(gameId, gameTeam);
	await ShopItem.deleteAll(gameId, gameTeam);
	const invItems = InvItem.all(gameId, gameTeam);

	const serverAction = {
		type: SHOP_TRANSFER,
		payload: {
			invItems
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

const confirmPlan = async (socket, pieceId, plan) => {
	//plan = moves array, where each move has type and positionId
	//confirm the plan and report back to the client with a server action
	//TODO: verify that this user is authorized to make a plan, among other checks for the entire plan
	//verify that the piece exists?
	//verify that this piece belongs to this team? (all those other auths)
	//need to know if this piece is a container or not, to check if container move was inserted
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const thisGame = new Game({ gameId });
	await thisGame.init();

	const thisPiece = new Piece(pieceId);
	await thisPiece.init();

	if (!thisGame || !thisPiece) {
		return;
	}

	const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId } = thisPiece;

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
				sendUserFeedback(socket, "sent a bad plan, container move for non-container piece...");
				return;
			}

			if (previousPosition != positionId) {
				sendUserFeedback(socket, "sent a bad plan, container move was not in previous position...");
				return;
			}
		}

		if (distanceMatrix[previousPosition][positionId] !== 1) {
			if (type !== "container") {
				sendUserFeedback(socket, "sent a bad plan, positions were not adjacent...");
				return;
			}
		}

		previousPosition = positionId;
	}

	//prepare the bulk insert
	let plansToInsert = [];
	for (let movementOrder = 0; movementOrder < plan.length; movementOrder++) {
		let { positionId, type } = plan[movementOrder];
		let specialFlag = type === "move" ? 0 : 1; // 1 = container, use other numbers for future special flags...
		plansToInsert.push([pieceGameId, pieceTeamId, pieceId, movementOrder, positionId, specialFlag]);
	}

	//bulk insert (always insert bulk, don't really ever insert single stuff, since a 'plan' is a collection of moves, but the table is 'Plans')
	await Plan.insert(plansToInsert);

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

	const thisGame = new Game({ gameId });
	await thisGame.init();

	if (!thisGame.gameActive) {
		return;
	}

	//can still run the query if the plan doesn't exist? (it won't fail...)

	await Plan.delete(pieceId);

	const serverAction = {
		type: DELETE_PLAN,
		payload: {
			pieceId
		}
	};

	socket.emit("serverSendingAction", serverAction);
};

// prettier-ignore
const mainButtonClick = async (io, socket) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const thisGame = new Game({gameId});
	await thisGame.init();

	const { gameActive, gamePhase, gameRound, gameSlice } = thisGame;

	if (!gameActive) {
		return;
	}

	const otherTeam = gameTeam == 0 ? 1 : 0;
	const thisTeamStatus = thisGame["game" + gameTeam + "Status"];
	const otherTeamStatus = thisGame["game" + otherTeam + "Status"];

	//Still Waiting
	if (thisTeamStatus == 1) {
		socket.emit("serverSendingAction", userFeedbackAction("Still waiting on other team..."));
		return;
	}

	//Now Waiting
	if (otherTeamStatus == 0) {
		await thisGame.setStatus(gameTeam, 1);
		let serverAction = {
			type: MAIN_BUTTON_CLICK,
			payload: {}
		};
		socket.emit("serverSendingAction", serverAction);
		return;
	}

	await thisGame.setStatus(otherTeam, 0);  //Could skip awaiting since not used later in this function...

	let serverAction;

	switch (gamePhase) {
		//News -> Purchase
		case 0:
			await thisGame.setPhase(1);

			serverAction = {
				type: PURCHASE_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			break;

		//Purchase -> Combat
		case 1:
			await thisGame.setPhase(2);

			serverAction = {
				type: COMBAT_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			break;

		//Place Troops -> News
		case 3:
			await thisGame.setPhase(0);

			serverAction = {
				type: NEWS_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			break;

		//Combat Phase -> Slice, Round, Place Troops...
		case 2:
			if (gameSlice == 0) {
				await thisGame.setSlice(1);

				serverAction = {
					type: SLICE_CHANGE,
					payload: {}
				};
				io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
				break;
			} else {
				//Slice 1 functionality
				let events = await Event.all(gameId);

				if (events.length > 0) {
					//deal with the event for one or both clients
					//loop through the events until one is doable, delete any that are no longer applicable
					//this happens when pieces get deleted (unless run script to auto delete those events...)
				}

				const currentMovementOrder0 = await Plan.getCurrentMovementOrder(gameId, 0);
				const currentMovementOrder1 = await Plan.getCurrentMovementOrder(gameId, 1);

				//No More Plans for either team
				if (currentMovementOrder0 == null && currentMovementOrder1 == null) {
					if (gameRound == 2) {
						await thisGame.setRound(0);
						await thisGame.setSlice(0);
						await thisGame.setPhase(3);

						serverAction = {
							type: PLACE_PHASE,
							payload: {}
						};
						io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
						break;
					} else {
						await thisGame.setRound(thisGame.gameRound + 1);
						await thisGame.setSlice(0);

						serverAction = {
							type: NEW_ROUND,
							payload: {
								gameRound: thisGame.gameRound
							}
						};
						io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
						break;
					}
				}

				//One of the teams may be without plans, keep them waiting
				if (currentMovementOrder0 == null) {
					await thisGame.setStatus(0, 1);
				}
				if (currentMovementOrder1 == null) {
					await thisGame.setStatus(1, 1);
				}

				const currentMovementOrder = currentMovementOrder0 || currentMovementOrder1;

				const allCollisionBattles = await Plan.getCollisionBattles(gameId, currentMovementOrder);
				if (allCollisionBattles.length > 0) {
					//each one of these has {pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 }
					//'position0-position1' => [piecesInvolved?]
					let allEvents = {};

					for (let x = 0; x < allCollisionBattles.length; x++) {
						let { pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 } = allCollisionBattles[x];

						let thisEventPositions = `${piecePositionId0}-${planPositionId0}`;

						//TODO: figure out if these 2 pieces would actually collide / battle
						//need to consider pieceVisibility as well...do pieces see each other when crossing over?

						if (!Object.keys(allEvents).includes(thisEventPositions)) {
							allEvents[thisEventPositions] = [];
						}
						if (!allEvents[thisEventPositions].includes(pieceId0)) {
							allEvents[thisEventPositions].push(pieceId0);
						}
						if (!allEvents[thisEventPositions].includes(pieceId1)) {
							allEvents[thisEventPositions].push(pieceId1);
						}
					}

					const bothTeamsIndicator = 2;
					const collisionEventType = 0;
					let eventInserts = [];
					for (let key in allEvents) {
						let newInsert = [gameId, bothTeamsIndicator, collisionEventType, key.split("-")[0], key.split("-")[1]];
						eventInserts.push(newInsert);
					}

					await Event.bulkInsertEvents(eventInserts);

					let eventItemInserts = [];
					for (let key in allEvents) {
						let eventPieces = allEvents[key];
						for (let z = 0; z < eventPieces.length; z++) {
							let newInsert = [eventPieces[z], gameId, key.split("-")[0], key.split("-")[1]];
							eventItemInserts.push(newInsert);
						}
					}

					await Event.bulkInsertItems(gameId, eventItemInserts);
				}

				await Piece.move(gameId, currentMovementOrder);
				await Piece.updateVisibilities(gameId);

				const allPositionBattles = await Plan.getPositionBattles(gameId);
				if (allPositionBattles.length > 0) {
					//TODO: also consider pieceVisibility
					let allPosEvents = {};
					for (let x = 0; x < allPositionBattles.length; x++) {
						let { pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1 } = allPositionBattles[x];

						let thisEventPosition = `${piecePositionId0}`;

						//TODO: figure out if these 2 pieces would actually collide / battle

						if (!Object.keys(allPosEvents).includes(thisEventPosition)) {
							allPosEvents[thisEventPosition] = [];
						}
						if (!allPosEvents[thisEventPosition].includes(pieceId0)) {
							allPosEvents[thisEventPosition].push(pieceId0);
						}
						if (!allPosEvents[thisEventPosition].includes(pieceId1)) {
							allPosEvents[thisEventPosition].push(pieceId1);
						}
					}
					
					const bothTeamsIndicator = 2;
					const posBattleEventType = 1;
					let eventInserts = [];
					for (let key in allPosEvents) {
						let newInsert = [gameId, bothTeamsIndicator, posBattleEventType, key, key]; //second key is to match # of columns for sql insert
						eventInserts.push(newInsert);
					}

					await Event.bulkInsertEvents(eventInserts);

					let eventItemInserts = [];
					for (let key in allPosEvents) {
						let eventPieces = allPosEvents[key];
						for (let z = 0; z < eventPieces.length; z++) {
							let newInsert = [eventPieces[z], gameId, key, key]; //second key is to match # of columns for sql insert
							eventItemInserts.push(newInsert);
						}
					}

					await Event.bulkInsertItems(gameId, eventItemInserts);
				}

				// TODO: create refuel events (special flag? / proximity) (check to see that the piece still exists!*!*) (still have plans from old pieces that used to exist? (but those would delete on cascade probaby...except the events themselves...))

				// TODO: create container events (special flag)

				const server0Action = {
					type: PIECES_MOVE,
					payload: {
						gameboardPieces: await Piece.getVisiblePieces(gameId, 0),
						gameStatus: thisGame.game0Status
					}
				};
				const server1Action = {
					type: PIECES_MOVE,
					payload: {
						gameboardPieces: await Piece.getVisiblePieces(gameId, 1),
						gameStatus: thisGame.game1Status
					}
				};
				io.sockets.in("game" + gameId + "team0").emit("serverSendingAction", server0Action);
				io.sockets.in("game" + gameId + "team1").emit("serverSendingAction", server1Action);
			}

			break;
		default:
			socket.emit("serverSendingAction", userFeedbackAction("Backend Failure, unkown gamePhase..."));
	}

	return;
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
		const thisGame = new Game({ gameId });
		await thisGame.init(); //need init to know section/instructor.... to reset back to those
		await thisGame.reset();
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
	if (adminSection == "CourseDirector" && adminInstructor == CourseDirectorLastName && inputPasswordHash == CourseDirectorPasswordHash) {
		req.session.ir3 = { courseDirector: true };
		res.redirect("/courseDirector.html");
		return;
	}

	try {
		const thisGame = new Game({ gameSection: adminSection, gameInstructor: adminInstructor });
		await thisGame.init();

		if (!thisGame) {
			res.redirect("/index.html?error=login");
			return;
		}

		if (thisGame["gameAdminPassword"] != inputPasswordHash) {
			res.redirect("/index.html?error=login");
			return;
		}

		req.session.ir3 = {
			gameId: thisGame.gameId,
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
	const { gameSection, gameInstructor, gameTeam, gameTeamPassword, gameController } = req.body;

	if (!gameSection || !gameInstructor || !gameTeam || !gameTeamPassword || !gameController) {
		res.redirect("/index.html?error=badRequest");
		return;
	}

	const inputPasswordHash = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password

	try {
		const thisGame = new Game({ gameSection, gameInstructor });
		await thisGame.init();

		if (!thisGame) {
			res.redirect("/index.html?error=login");
			return;
		}

		if (thisGame["gameActive"] != 1) {
			res.redirect("/index.html?error=gameNotActive");
		} else if (thisGame[commanderLoginField] != 0) {
			res.redirect("/index.html?error=alreadyLoggedIn");
		} else if (inputPasswordHash != thisGame[passwordHashToCheck]) {
			res.redirect("/index.html?error=login");
		} else {
			await thisGame.setLoggedIn(gameTeam, gameController, 1);

			const { gameId } = thisGame;

			req.session.ir3 = {
				gameId,
				gameTeam,
				gameController
			};

			res.redirect("/game.html");
		}
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
		const results = await Game.getGames();
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
		const thisGame = new Game({ gameId });
		await thisGame.init();

		const { gameActive } = thisGame;

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
		const thisGame = new Game({ gameId });
		await thisGame.init();
		const newValue = (thisGame.gameActive + 1) % 2;
		await thisGame.setGameActive(newValue);

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
		const queryString = fs.readFileSync("./serverItems/sqlScripts/tableInsert.sql").toString();
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

		//TODO: validate inputs are within limits of database (4 characters for section....etc)

		const thisGame = await Game.add(adminSection, adminInstructor, adminPasswordHashed);

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
		await Game.delete(gameId);
		res.redirect("/courseDirector.html?gameDelete=success");
	} catch (error) {
		console.log(error);
		res.status(500).redirect("/courseDirector.html?gameDelete=failed");
	}
};

exports.socketSetup = async (io, socket) => {
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", "access");
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Room for the Game
	socket.join("game" + gameId);

	//Room for the Team
	socket.join("game" + gameId + "team" + gameTeam);

	//Room for the Indiviual Controller
	socket.join("game" + gameId + "team" + gameTeam + "controller" + gameController);

	//TODO: Server Side Rendering with react?
	//"Immediatly" send the client intial game state data
	const thisGame = new Game({ gameId });
	await thisGame.init();
	const action = await thisGame.initialStateAction(gameTeam, gameController);
	socket.emit("serverSendingAction", action);

	//TODO: reflect that the argument is a payload, change these to be objects that the server is receiving for continuity
	socket.on("shopPurchaseRequest", shopItemTypeId => {
		try {
			shopPurchaseRequest(socket, shopItemTypeId);
		} catch (error) {
			console.log(error);
			socket.emit("serverSendingAction", userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE"));
		}
	});

	socket.on("shopRefundRequest", shopItem => {
		try {
			shopRefundRequest(socket, shopItem);
		} catch (error) {
			console.log(error);
			socket.emit("serverSendingAction", userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE"));
		}
	});

	socket.on("shopConfirmPurchase", () => {
		try {
			shopConfirmPurchase(socket);
		} catch (error) {
			console.log(error);
			socket.emit("serverSendingAction", userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE"));
		}
	});

	socket.on("confirmPlan", payload => {
		const { pieceId, plan } = payload;

		try {
			confirmPlan(socket, pieceId, plan);
		} catch (error) {
			console.log(error);
			socket.emit("serverSendingAction", userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE"));
		}
	});

	socket.on("deletePlan", payload => {
		const { pieceId } = payload;

		try {
			deletePlan(socket, pieceId);
		} catch (error) {
			console.log(error);
			socket.emit("serverSendingAction", userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE"));
		}
	});

	socket.on("mainButtonClick", () => {
		try {
			mainButtonClick(io, socket);
		} catch (error) {
			console.log(error);
			socket.emit("serverSendingAction", userFeedbackAction("INTERNAL SERVER ERROR: CHECK DATABASE"));
		}
	});

	socket.on("disconnect", async () => {
		const { gameId, gameTeam, gameController } = socket.handshake.session.ir3; //Assume we have this, if this method is ever called (from sockets)
		const thisGame = new Game({ gameId });
		try {
			await thisGame.setLoggedIn(gameTeam, gameController, 0);
		} catch (error) {
			console.log(error);
			//nothing to send to client, they disconnected from the socket already...
		}
	});
};
