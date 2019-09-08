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

	const thisGame = new Game(gameId);
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

	const thisGame = new Game(gameId);
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

	const thisGame = new Game(gameId); //TODO: init could fail if gameId was invalid
	await thisGame.init();

	const thisPiece = new Piece(pieceId); //TODO: init could fail if pieceId was invalid
	await thisPiece.init();

	const { piecePositionId, pieceTypeId } = thisPiece;

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
	const { pieceGameId, pieceTeamId } = thisPiece;
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

	const thisGame = new Game(gameId);
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
	//verify that this person is ok to click the button
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const thisGame = new Game(gameId);
	await thisGame.init();

	const { gameActive, gamePhase, game0Status, game1Status, gameRound, gameSlice } = thisGame;

	//need to do different things based on the phase?
	if (!gameActive) {
		return;
	}

	const thisTeamStatus = parseInt(gameTeam) === 0 ? game0Status : game1Status;
	const otherTeamStatus = parseInt(gameTeam) === 0 ? game1Status : game0Status;

	//thisTeamStatus == 1
	if (parseInt(thisTeamStatus) === 1) {
		//already pressed / already waiting
		socket.emit("serverSendingAction", userFeedbackAction("Still waiting on other team..."));
		return;
	}

	if (parseInt(otherTeamStatus) === 0) {
		//other team still active, not yet ready to move on
		//mark this team as waiting

		thisGame.setStatus(gameTeam, 1);

		let serverAction = {
			type: MAIN_BUTTON_CLICK,
			payload: {}
		};
		socket.emit("serverSendingAction", serverAction);
		return;
	} else {
		//both teams done with this phase, round, slice, move...
		//mark other team as no longer waiting
		//TODO: figure out which team would actually be changing, instead of calling twice
		thisGame.setStatus(0, 0);
		thisGame.setStatus(1, 0);

		let serverAction;

		switch (parseInt(gamePhase)) {
			case 0:
				//news -> purchase
				await thisGame.setPhase(1);

				//let the everyone know stuff

				serverAction = {
					type: PURCHASE_PHASE,
					payload: {}
				};

				io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
				break;

			case 1:
				//purchase -> combat
				await thisGame.setPhase(2);

				//let the everyone know stuff

				serverAction = {
					type: COMBAT_PHASE,
					payload: {}
				};

				io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
				break;

			case 3:
				//place troops -> news phase
				await thisGame.setPhase(0);

				serverAction = {
					type: NEWS_PHASE,
					payload: {}
				};

				io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
				break;

			case 2:
				//combat phase controls (-> slice, -> execute/step, -> round++, -> place phase)
				if (parseInt(gameSlice) === 0) {
					//they are done making the plans for this round
					await thisGame.setSlice(1);

					//need to let the clients know that done with planning, ready to execute
					serverAction = {
						type: SLICE_CHANGE,
						payload: {}
					};

					io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
					break;
				} else {
					// check for any events that exist prior to dealing with plans, execute events 1 by 1

					let events = await Event.all(gameId);

					if (events.length > 0) {
						//deal with the event for one or both clients
						//loop through the events until one is doable, delete any that are no longer applicable
						//this happens when pieces get deleted (unless run script to auto delete those events...)
					}

					const currentMovementOrder0 = await Plan.getCurrentMovementOrder(gameId, 0);
					const currentMovementOrder1 = await Plan.getCurrentMovementOrder(gameId, 1);

					if (!currentMovementOrder0 && !currentMovementOrder1) {
						//both teams are done with plans
						if (gameRound === 2) {
							//move to place phase
							await thisGame.setRound(0);
							await thisGame.setSlice(0);
							await thisGame.setPhase(3);

							serverAction = {
								type: PLACE_PHASE,
								payload: {}
							};

							io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
						} else {
							//move to next round
							await thisGame.setRound(thisGame.gameRound + 1);
							await thisGame.setSlice(0);

							serverAction = {
								type: NEW_ROUND,
								payload: {
									gameRound: this.gameRound
								}
							};

							io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
						}

						break;
					}

					let currentMovementOrder;

					//one of these should fire, since above check failed to exit
					//keeping the empty plan team at status1
					let game0StatusNew = 1;
					if (!currentMovementOrder0) {
						await thisGame.setStatus(0, 1);
					} else {
						currentMovementOrder = currentMovementOrder0;
						game0StatusNew = 0;
					}

					let game1StatusNew = 1;
					if (!currentMovementOrder1) {
						await thisGame.setStatus(1, 1);
					} else {
						currentMovementOrder = currentMovementOrder1;
						game1StatusNew = 0;
					}

					// check for collision battles
					const allCollisionBattles = await Plan.getCollisionBattles(gameId, currentMovementOrder);

					if (allCollisionBattles.length > 0) {
						//filter through each collision battle and create events for it
						//multiple pieces colliding -> same event...
						//event has a touple identifier? (collision between x,y)
						//each one of these has {pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 }
						//multiple collisions need to go to the same event, but getting multiple's from the database query, since 1 tank vs 2 tanks has 2 separate collisions
						let allEvents = {};

						//'position0-position1' => [piecesInvolved?]
						//all events are team0 - team1, so no need to worry about team1 - team0 duplicates (probably)

						for (let x = 0; x < allCollisionBattles.length; x++) {
							let {
								pieceId0,
								pieceTypeId0,
								pieceContainerId0,
								piecePositionId0,
								planPositionId0,
								pieceId1,
								pieceTypeId1,
								pieceContainerId1,
								piecePositionId1,
								planPositionId1
							} = allCollisionBattles[x];

							// only need to check stuff from 0 -> 1
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

						//bulk insert for eventQueue
						let allInserts = [];
						const bothTeamsIndicator = 2;
						const collisionEventType = 0;
						for (let key in allEvents) {
							let newInsert = [gameId, bothTeamsIndicator, collisionEventType, key.split("-")[0], key.split("-")[1]];
							allInserts.push(newInsert);
						}

						await Event.bulkInsertEvents(allInserts)

						//bulk insert for eventItems where posa = posb (to match the eventId?)
						//need to insert into temporary table and then insert into table1 select whatever from table2 join table3
						allInserts = [];

						for (let key in allEvents) {
							let eventPieces = allEvents[key];
							for (let z = 0; z < eventPieces.length; z++) {
								let newInsert = [eventPieces[z], gameId, key.split("-")[0], key.split("-")[1]];
								allInserts.push(newInsert);
							}
						}

						await Event.bulkInsertItems(gameId, allInserts);
					}

					await Piece.move(gameId, currentMovementOrder);

					await Piece.updateVisibilities(gameId);

					const allPositionBattles = await Plan.getPositionBattles(gameId);

					if (allPositionBattles.length > 0) {
						//filter through each position battle and create events for it
						//multiple pieces in same position -> same event
						//event has 1 identifier (position battle at x)
						//TODO: also consider pieceVisibility?

						let allPosEvents = {};

						for (let x = 0; x < allPositionBattles.length; x++) {
							let { pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1 } = allPositionBattles[x];

							// only need to check stuff from 0 -> 1
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

						//bulk insert for eventQueue
						let allInserts = [];
						const bothTeamsIndicator = 2;
						const posBattleEventType = 1;
						for (let key in allPosEvents) {
							let newInsert = [gameId, bothTeamsIndicator, posBattleEventType, key];
							allInserts.push(newInsert);
						}

						await Event.bulkInsertEvents(allInserts);

						//bulk insert for eventItems
						allInserts = [];

						for (let key in allPosEvents) {
							let eventPieces = allPosEvents[key];
							for (let z = 0; z < eventPieces.length; z++) {
								let newInsert = [eventPieces[z], gameId, key];
								allInserts.push(newInsert);
							}
						}

						await Event.bulkInsertItems(gameId, allInserts);
					}

					// create refuel events (special flag? / proximity) (check to see that the piece still exists!*!*)
					// create container events (special flag)

					//create final update to each client
					const server0Action = {
						type: PIECES_MOVE,
						payload: {
							gameboardPieces: await Piece.getVisiblePieces(gameId, 0),
							gameStatus: game0StatusNew
						}
					};

					const server1Action = {
						type: PIECES_MOVE,
						payload: {
							gameboardPieces: await Piece.getVisiblePieces(gameId, 1),
							gameStatus: game1StatusNew
						}
					};

					//send final update to each client
					//TODO: probably cleaner way of doing this, instead of passing down io, pass down a function that has access to io?
					io.sockets.in("game" + gameId + "team0").emit("serverSendingAction", server0Action);
					io.sockets.in("game" + gameId + "team1").emit("serverSendingAction", server1Action);
				}

				break;
			default:
				socket.emit("serverSendingAction", userFeedbackAction("Backend Failure, unkown gamePhase..."));
		}

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
		const thisGame = new Game(gameId);
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
		const gameId = await Game.findGameId(adminSection, adminInstructor);

		if (!gameId) {
			res.redirect("/index.html?error=login");
			return;
		}

		const thisGame = new Game(gameId);
		await thisGame.init();

		if (thisGame["gameAdminPassword"] != inputPasswordHash) {
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
	const { gameSection, gameInstructor, gameTeam, gameTeamPassword, gameController } = req.body;

	if (!gameSection || !gameInstructor || !gameTeam || !gameTeamPassword || !gameController) {
		res.redirect("/index.html?error=badRequest");
		return;
	}

	const inputPasswordHash = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password

	try {
		const gameId = await Game.findGameId(gameSection, gameInstructor);

		if (!gameId) {
			res.redirect("/index.html?error=login");
			return;
		}

		const thisGame = new Game(gameId);
		await thisGame.init();

		if (thisGame["gameActive"] != 1) {
			res.redirect("/index.html?error=gameNotActive");
		} else if (thisGame[commanderLoginField] != 0) {
			res.redirect("/index.html?error=alreadyLoggedIn");
		} else if (inputPasswordHash != thisGame[passwordHashToCheck]) {
			res.redirect("/index.html?error=login");
		} else {
			await thisGame.markLoggedIn(gameTeam, gameController);

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
		const thisGame = new Game(gameId);
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
		const thisGame = new Game(gameId); //didn't need to .init(), that only adds the gameInfo
		thisGame.toggleGameActive();

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

		await Game.add(adminSection, adminInstructor, adminPasswordHashed);

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
	const thisGame = new Game(gameId);
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
		const thisGame = new Game(gameId);
		try {
			await thisGame.markLoggedOut(gameTeam, gameController);
		} catch (error) {
			console.log(error);
			//nothing to send to client, they disconnected from the socket already...
		}
	});
};
