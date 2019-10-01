const md5 = require("md5");
const fs = require("fs");
const CONSTANTS = require("./constants");
const distanceMatrix = require("./distanceMatrix");
const pool = require("./database");
const { Game, ShopItem, InvItem, Piece, Plan, Event } = require("./classes");

const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
const CourseDirectorPasswordHash = process.env.CD_PASSWORD || "912ec803b2ce49e4a541068d495ab570"; //"asdf"

const shopPurchaseRequest = async (socket, shopItemTypeId) => {
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const thisGame = await new Game({ gameId }).init();

	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	const { gameActive, gamePhase } = thisGame;

	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}
	if (gamePhase != 1) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}
	if (gameController != 0) {
		sendUserFeedback(socket, "Not the main controller (0)...");
		return;
	}

	const shopItemCost = CONSTANTS.SHOP_ITEM_TYPE_COSTS[shopItemTypeId];
	const teamPoints = thisGame["game" + gameTeam + "Points"];

	if (teamPoints < shopItemCost) {
		sendUserFeedback(socket, "Not enough points to purchase");
		return;
	}

	const newPoints = teamPoints - shopItemCost;
	await thisGame.setPoints(gameTeam, newPoints);

	const shopItem = await ShopItem.insert(gameId, gameTeam, shopItemTypeId);

	const serverAction = {
		type: CONSTANTS.SHOP_PURCHASE,
		payload: {
			shopItem,
			points: newPoints
		}
	};
	socket.emit("serverSendingAction", serverAction);
	return;
};

const shopRefundRequest = async (socket, shopItem) => {
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	//Is this action currently allowed to this user?
	const { gameActive, gamePhase } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}
	if (gamePhase != 1) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}
	if (gameController != 0) {
		sendUserFeedback(socket, "Not the main controller (0)...");
		return;
	}

	//Does the item exist?
	const { shopItemId } = shopItem;
	const thisShopItem = await new ShopItem(shopItemId).init();
	if (!thisShopItem) {
		sendUserFeedback(socket, "Shop Item did not exist...");
		return;
	}

	const { shopItemGameId, shopItemTeamId, shopItemTypeId } = thisShopItem;

	//Do they own the shop item?
	if (shopItemGameId != gameId || shopItemTeamId != gameTeam) {
		socket.emit("serverRedirect", CONSTANTS.BAD_REQUEST_TAG);
		return;
	}

	const itemCost = CONSTANTS.SHOP_ITEM_TYPE_COSTS[shopItemTypeId];
	const teamPoints = thisGame["game" + gameTeam + "Points"];

	const newPoints = teamPoints + itemCost;
	await thisGame.setPoints(gameTeam, newPoints);
	await thisShopItem.delete();

	//TODO: consistency between payloads for different actions (pointsAdded vs points)
	const serverAction = {
		type: CONSTANTS.SHOP_REFUND,
		payload: {
			shopItem: shopItem,
			pointsAdded: itemCost
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const shopConfirmPurchase = async socket => {
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	//Is this action currently allowed to this user?
	const { gameActive, gamePhase } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}
	if (gamePhase != 1) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}
	if (gameController != 0) {
		sendUserFeedback(socket, "Not the main controller (0)...");
		return;
	}

	await InvItem.insertFromShop(gameId, gameTeam);
	await ShopItem.deleteAll(gameId, gameTeam);
	const invItems = await InvItem.all(gameId, gameTeam); //TODO: this may cause an error on the front end, check what happens when confirm purchase executes...

	const serverAction = {
		type: CONSTANTS.SHOP_TRANSFER,
		payload: {
			invItems
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const sendUserFeedback = async (socket, userFeedback) => {
	const serverAction = {
		type: CONSTANTS.SET_USERFEEDBACK,
		payload: {
			userFeedback
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const confirmPlan = async (socket, pieceId, plan) => {
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	//Is this action currently allowed to this user?
	const { gameActive, gamePhase, gameSlice } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}
	if (gamePhase != 2 && gameSlice != 0) {
		sendUserFeedback(socket, "Not the right phase/slice...looking for phase 2 slice 0");
		return;
	}

	//Does the piece exist? (And match for this game/team/controller)
	const thisPiece = await new Piece(pieceId).init();
	if (!thisPiece) {
		sendUserFeedback(socket, "Piece did not exists...refresh page?");
		return;
	}
	const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId } = thisPiece;
	if (pieceGameId != gameId || pieceTeamId != gameTeam) {
		sendUserFeedback(socket, "Piece did not belong to your team...(or this game)");
		return;
	}

	//TODO: what controllers can make the plans for this piece type?

	const isContainer = CONSTANTS.CONTAINER_TYPES.includes(pieceTypeId);

	//Check adjacency and other parts of the plan to make sure the whole thing makes sense
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
	//TODO: could change the phrasing on Plan vs Moves (as far as inserting..function names...database entries??)
	await Plan.insert(plansToInsert);

	//TODO: send the pieceId or the whole piece object? (be consistent if possible with other payloads...)
	const serverAction = {
		type: CONSTANTS.PLAN_WAS_CONFIRMED,
		payload: {
			pieceId,
			plan
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const deletePlan = async (socket, pieceId) => {
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	//Is this action currently allowed to this user?
	const { gameActive, gamePhase, gameSlice } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}
	if (gamePhase != 2 && gameSlice != 0) {
		sendUserFeedback(socket, "Not the right phase/slice...looking for phase 2 slice 0");
		return;
	}

	//Does the piece exist? (And match for this game/team/controller)
	const thisPiece = await new Piece(pieceId).init();
	if (!thisPiece) {
		sendUserFeedback(socket, "Piece did not exists...refresh page?");
		return;
	}
	const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId } = thisPiece;
	if (pieceGameId != gameId && pieceTeamId != gameTeam) {
		sendUserFeedback(socket, "Piece did not belong to your team...(or this game)");
		return;
	}

	//TODO: what controllers can make the plans for this piece type?

	await thisPiece.deletePlans();

	const serverAction = {
		type: CONSTANTS.DELETE_PLAN,
		payload: {
			pieceId
		}
	};
	socket.emit("serverSendingAction", serverAction);
};

const mainButtonClick = async (io, socket) => {
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}
	const { gameActive, gamePhase, gameRound, gameSlice } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}

	//Who is allowed to press that button?
	if (gameController != 0) {
		sendUserFeedback(socket, "Wrong Controller to click that button...");
		return;
	}

	const otherTeam = gameTeam == 0 ? 1 : 0;
	const thisTeamStatus = thisGame["game" + gameTeam + "Status"];
	const otherTeamStatus = thisGame["game" + otherTeam + "Status"];

	//Still Waiting
	if (thisTeamStatus == 1) {
		sendUserFeedback(socket, "Still waiting on other team...");
		return;
	}

	//Now Waiting
	if (otherTeamStatus == 0) {
		await thisGame.setStatus(gameTeam, 1);
		let serverAction = {
			type: CONSTANTS.MAIN_BUTTON_CLICK,
			payload: {}
		};
		socket.emit("serverSendingAction", serverAction);
		return;
	}

	await thisGame.setStatus(otherTeam, 0); //Could skip awaiting since not used later in this function...

	let serverAction;

	switch (gamePhase) {
		//News -> Purchase
		case 0:
			await thisGame.setPhase(1);

			serverAction = {
				type: CONSTANTS.PURCHASE_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			break;

		//Purchase -> Combat
		case 1:
			await thisGame.setPhase(2);

			serverAction = {
				type: CONSTANTS.COMBAT_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			break;

		//Place Troops -> News
		case 3:
			await thisGame.setPhase(0);

			serverAction = {
				type: CONSTANTS.NEWS_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			break;

		//Combat Phase -> Slice, Round, Place Troops... (stepping through)
		case 2:
			if (gameSlice == 0) {
				await thisGame.setSlice(1);

				serverAction = {
					type: CONSTANTS.SLICE_CHANGE,
					payload: {}
				};
				io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			} else {
				await executeStep(io, socket, thisGame);
			}
			break;
		default:
			sendUserFeedback(socket, "Backend Failure, unkown gamePhase...");
	}
};

const executeStep = async (io, socket, thisGame) => {
	//inserting events here and moving pieces, or changing to new round or something...
	const { gameId, gameRound } = thisGame;

	//make sure no more events are here, if events exist, need to wait for other team to do stuff
	//UNLIKELY THIS WOULD HAPPEN, THIS WOULD MEAN THAT -> other team is in a waiting status while other team is handling its own event...
	// const nextEvent = await Event.getNextAnyteam(gameId);
	// if (nextEvent) {
	// 	//need to send client that still waiting on otherevents to finish
	// 	sendUserFeedback(socket, "still waiting on all events to finish for this step...");
	// 	return;
	// }

	const currentMovementOrder0 = await Plan.getCurrentMovementOrder(gameId, 0);
	const currentMovementOrder1 = await Plan.getCurrentMovementOrder(gameId, 1);

	//No More Plans for either team
	//DOESN'T MAKE PLANS FOR PIECES STILL IN THE SAME POSITION...NEED TO HAVE AT LEAST 1 PLAN FOR ANYTHING TO HAPPEN (pieces in same postion would battle (again?) if there was 1 plan elsewhere...)
	if (currentMovementOrder0 == null && currentMovementOrder1 == null) {
		if (gameRound == 2) {
			await thisGame.setRound(0);
			await thisGame.setSlice(0);
			await thisGame.setPhase(3);

			serverAction = {
				type: CONSTANTS.PLACE_PHASE,
				payload: {}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			return;
		} else {
			await thisGame.setRound(gameRound + 1);
			await thisGame.setSlice(0);

			serverAction = {
				type: CONSTANTS.NEW_ROUND,
				payload: {
					gameRound: thisGame.gameRound
				}
			};
			io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
			return;
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

	await Piece.move(gameId, currentMovementOrder); //changes the piecePositionId, deletes the plan, all for specialflag = 0
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

	// Note: All non-move (specialflag != 0) plans should result in events (refuel/container)...
	// If there is now an event, send to user instead of PIECES_MOVE

	//Don't really like doing it this way, but sorta clean?
	let gameEvents = [null, null];
	let serverActions = [{}, {}];

	let friendlyPiecesList;
	let enemyPiecesList;
	let friendlyPieces;
	let enemyPieces;

	gameEvents[0] = await Event.getNext(gameId, 0);
	if (gameEvents[0]) {
		const type = gameEvents[0].eventTypeId;

		switch (type) {
			case 0: //collision and position (TODO: make these constants, refactor how events are handled? (move this code out somewhere...))
				//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

				//need to transform eventItems in the battle object for the frontend to use
				//need to create this battle object entirely? (frontend becomes easy if we do this, or just the friendly pieces and enemy pieces)
				friendlyPiecesList = await gameEvents[0].getTeamItems(0);
				enemyPiecesList = await gameEvents[0].getTeamItems(1);
				friendlyPieces = [];
				enemyPieces = [];

				for (let x = 0; x < friendlyPiecesList.length; x++) {
					//need to transform pieces and stuff... (not necessarily, could let client do more work...)(would also get rid of duplicate code if there was some (maybe))
					let thisFriendlyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisFriendlyPiece.piece = friendlyPiecesList[x];
					friendlyPieces.push(thisFriendlyPiece);
				}

				for (let y = 0; y < enemyPiecesList.length; y++) {
					let thisEnemyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisEnemyPiece.piece = enemyPiecesList[y];
					enemyPieces.push(thisEnemyPiece);
				}

				serverActions[0] = {
					type: CONSTANTS.EVENT_BATTLE,
					payload: {
						friendlyPieces,
						enemyPieces
					}
				};
				break;
			case 1: //collision and position (TODO: make these constants, refactor how events are handled? (move this code out somewhere...))
				//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

				//need to transform eventItems in the battle object for the frontend to use
				//need to create this battle object entirely? (frontend becomes easy if we do this, or just the friendly pieces and enemy pieces)
				friendlyPiecesList = await gameEvents[0].getTeamItems(0);
				enemyPiecesList = await gameEvents[0].getTeamItems(1);
				friendlyPieces = [];
				enemyPieces = [];

				for (let x = 0; x < friendlyPiecesList.length; x++) {
					//need to transform pieces and stuff... (not necessarily, could let client do more work...)(would also get rid of duplicate code if there was some (maybe))
					let thisFriendlyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisFriendlyPiece.piece = friendlyPiecesList[x];
					friendlyPieces.push(thisFriendlyPiece);
				}

				for (let y = 0; y < enemyPiecesList.length; y++) {
					let thisEnemyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisEnemyPiece.piece = enemyPiecesList[y];
					enemyPieces.push(thisEnemyPiece);
				}

				serverActions[0] = {
					type: CONSTANTS.EVENT_BATTLE,
					payload: {
						friendlyPieces,
						enemyPieces
					}
				};
				break;
			default:
				//this would never happen (hopefully)
				console.log("default unknown event type! (this should not have happened...)");
				return;
		}
	} else {
		//send the client that they are waiting for the next move? (need to change status?)
		serverActions[0] = {
			type: CONSTANTS.NO_MORE_EVENTS,
			payload: {} //don't need this...
		};
	}

	gameEvents[1] = await Event.getNext(gameId, 1);
	if (gameEvents[1]) {
		const type = gameEvents[1].eventTypeId;

		//TODO: duplicate code everywhere, refactor this (DRY)
		switch (type) {
			case 0:
				//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

				friendlyPiecesList = await gameEvents[1].getTeamItems(1);
				enemyPiecesList = await gameEvents[1].getTeamItems(0);
				friendlyPieces = [];
				enemyPieces = [];

				for (let x = 0; x < friendlyPiecesList.length; x++) {
					//need to transform pieces and stuff...
					let thisFriendlyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisFriendlyPiece.piece = friendlyPiecesList[x];
					friendlyPieces.push(thisFriendlyPiece);
				}

				for (let y = 0; y < enemyPiecesList.length; y++) {
					let thisEnemyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisEnemyPiece.piece = enemyPiecesList[y];
					enemyPieces.push(thisEnemyPiece);
				}

				serverActions[1] = {
					type: CONSTANTS.EVENT_BATTLE,
					payload: {
						friendlyPieces,
						enemyPieces
					}
				};
				break;
			case 1:
				//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

				friendlyPiecesList = await gameEvents[1].getTeamItems(1);
				enemyPiecesList = await gameEvents[1].getTeamItems(0);
				friendlyPieces = [];
				enemyPieces = [];

				for (let x = 0; x < friendlyPiecesList.length; x++) {
					//need to transform pieces and stuff...
					let thisFriendlyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisFriendlyPiece.piece = friendlyPiecesList[x];
					friendlyPieces.push(thisFriendlyPiece);
				}

				for (let y = 0; y < enemyPiecesList.length; y++) {
					let thisEnemyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisEnemyPiece.piece = enemyPiecesList[y];
					enemyPieces.push(thisEnemyPiece);
				}

				serverActions[1] = {
					type: CONSTANTS.EVENT_BATTLE,
					payload: {
						friendlyPieces,
						enemyPieces
					}
				};
				break;
			default:
				//this would never happen (famous last words)
				return;
		}
	} else {
		serverActions[1] = {
			type: CONSTANTS.NO_MORE_EVENTS,
			payload: {} //don't need this...
		};
	}

	//sending the events that we got, or "no more events"? (but also sending piece moves after this...should combine...)
	io.sockets.in("game" + gameId + "team0").emit("serverSendingAction", serverActions[0]);
	io.sockets.in("game" + gameId + "team1").emit("serverSendingAction", serverActions[1]);

	//also send them the updated pieces anyways? //TODO: could send with first package, and avoid 2 requests (but need a special action type?)
	io.sockets.in("game" + gameId + "team0").emit("serverSendingAction", {
		type: CONSTANTS.PIECES_MOVE,
		payload: {
			gameboardPieces: await Piece.getVisiblePieces(gameId, 0),
			gameStatus: thisGame["game" + 1 + "Status"]
		}
	});
	io.sockets.in("game" + gameId + "team1").emit("serverSendingAction", {
		type: CONSTANTS.PIECES_MOVE,
		payload: {
			gameboardPieces: await Piece.getVisiblePieces(gameId, 1),
			gameStatus: thisGame["game" + 1 + "Status"]
		}
	});
};

const piecePlace = async (io, socket, invItemId, selectedPosition) => {
	//TODO: need a way of undoing piece places
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	//Is this action currently allowed to this user?
	const { gameActive, gamePhase } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}
	if (gamePhase != 3) {
		sendUserFeedback(socket, "Not the right phase...");
		return;
	}

	// Different controllers place their own piece types? TODO: make this part of the checks...
	// if (gameController != 0) {
	// 	sendUserFeedback(socket, "Not the main controller (0)...");
	// 	return;
	// }

	const thisInvItem = await new InvItem(invItemId).init();

	//Does the item exist?
	if (!thisInvItem) {
		sendUserFeedback(socket, "Inv Item did not exist...");
		return;
	}

	const { invItemGameId, invItemTeamId } = thisInvItem;

	//Do they own this item?
	if (invItemGameId != gameId || invItemTeamId != gameTeam) {
		socket.emit("serverRedirect", CONSTANTS.BAD_REQUEST_TAG);
		return;
	}

	//Other checks go here.......TODO: more checks...(position types and piece types...blah blah blah...)
	//does this positionId even exist? (lots of weird things could happen....(but probably won't...))

	const newPiece = await thisInvItem.placeOnBoard(selectedPosition); //should also check that this piece actually got created, could return null (should return null if it failed...TODO: return null if failed...)
	//need to send this piece to the client...

	newPiece.pieceContents = { pieces: [] }; //new pieces have nothing in them, and piece contents is required for the frontend...

	const serverAction = {
		type: CONSTANTS.PIECE_PLACE,
		payload: {
			invItemId,
			positionId: selectedPosition,
			newPiece
		}
	};

	//need to send this to the whole team...
	io.sockets.in("game" + gameId + "team" + gameTeam).emit("serverSendingAction", serverAction);
};

const confirmBattleSelection = async (io, socket, friendlyPieces) => {
	//Does the server know this user?
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Does the game exist?
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		socket.emit("serverRedirect", CONSTANTS.GAME_DOES_NOT_EXIST);
		return;
	}

	//Is this action currently allowed to this user?
	const { gameActive, gamePhase } = thisGame;
	if (!gameActive) {
		socket.emit("serverRedirect", CONSTANTS.GAME_INACTIVE_TAG);
		return;
	}

	const thisTeamStatus = thisGame[`game${gameTeam}Status`];
	if (thisTeamStatus == 1) {
		sendUserFeedback(socket, "still waiting stupid...");
		return;
	}

	//confirm the selections
	const thisTeamsCurrentEvent = await Event.getNext(gameId, gameTeam);
	await thisTeamsCurrentEvent.bulkUpdateTargets(friendlyPieces); //TODO: since already have friendly pieces, could in theory only request enemy pieces from database for efficiency, but likely too much work for too little reward

	//are we waiting for the other client?
	const otherTeam = gameTeam == 0 ? 1 : 0;
	const otherTeamStatus = thisGame[`game${otherTeam}Status`];

	if (otherTeamStatus == 0) {
		await thisGame.setStatus(gameTeam, 1);
		sendUserFeedback(socket, "confirmed, now waiting on other team...");
		return;
	}

	//if get here, other team was already waiting, need to set them to 0 and handle stuff
	await thisGame.setStatus(otherTeam, 0);

	//Do the fight!
	const fightResults = await thisTeamsCurrentEvent.fight();

	if (fightResults.atLeastOneBattle) {
		//send the fightResults (masterrecord to client, let them click confirm again for this battle)
		//sending to both clients the same results, they will handle showing them in their own way...(different indexes and stuff)
		const serverAction = {
			type: CONSTANTS.BATTLE_FIGHT_RESULTS,
			payload: {
				masterRecord: fightResults.masterRecord
			}
		};

		io.sockets.in("game" + gameId).emit("serverSendingAction", serverAction);
	} else {
		//delete this event, try to send next event to client (battle.active = false? (stuff like that...))
		await thisTeamsCurrentEvent.delete();

		//get next?
		//send to individual clients?
		//same as the end of execute step?

		//Don't really like doing it this way, but sorta clean?
		let gameEvents = [null, null];
		let serverActions = [{}, {}];

		//TODO: remove this duplicate code, put into a function probably...(or rename variables to be part of the equation for these??
		//event handler?
		//FUNCTION: GIVE THE CLIENT NEXT THING THAT HAPPENS (EVENT OR NOTHING), they need to click for next execute anyways...

		let friendlyPiecesList;
		let enemyPiecesList;
		let friendlyPieces;
		let enemyPieces;

		gameEvents[0] = await Event.getNext(gameId, 0);
		if (gameEvents[0]) {
			const type = gameEvents[0].eventTypeId;

			switch (type) {
				case 0: //collision and position (TODO: make these constants, refactor how events are handled? (move this code out somewhere...))
					//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

					//need to transform eventItems in the battle object for the frontend to use
					//need to create this battle object entirely? (frontend becomes easy if we do this, or just the friendly pieces and enemy pieces)
					friendlyPiecesList = await gameEvents[0].getTeamItems(0);
					enemyPiecesList = await gameEvents[0].getTeamItems(1);
					friendlyPieces = [];
					enemyPieces = [];

					for (let x = 0; x < friendlyPiecesList.length; x++) {
						//need to transform pieces and stuff... (not necessarily, could let client do more work...)(would also get rid of duplicate code if there was some (maybe))
						let thisFriendlyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisFriendlyPiece.piece = friendlyPiecesList[x];
						friendlyPieces.push(thisFriendlyPiece);
					}

					for (let y = 0; y < enemyPiecesList.length; y++) {
						let thisEnemyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisEnemyPiece.piece = enemyPiecesList[y];
						enemyPieces.push(thisEnemyPiece);
					}

					serverActions[0] = {
						type: CONSTANTS.EVENT_BATTLE,
						payload: {
							friendlyPieces,
							enemyPieces
						}
					};
					break;
				case 1: //collision and position (TODO: make these constants, refactor how events are handled? (move this code out somewhere...))
					//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

					//need to transform eventItems in the battle object for the frontend to use
					//need to create this battle object entirely? (frontend becomes easy if we do this, or just the friendly pieces and enemy pieces)
					friendlyPiecesList = await gameEvents[0].getTeamItems(0);
					enemyPiecesList = await gameEvents[0].getTeamItems(1);
					friendlyPieces = [];
					enemyPieces = [];

					for (let x = 0; x < friendlyPiecesList.length; x++) {
						//need to transform pieces and stuff... (not necessarily, could let client do more work...)(would also get rid of duplicate code if there was some (maybe))
						let thisFriendlyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisFriendlyPiece.piece = friendlyPiecesList[x];
						friendlyPieces.push(thisFriendlyPiece);
					}

					for (let y = 0; y < enemyPiecesList.length; y++) {
						let thisEnemyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisEnemyPiece.piece = enemyPiecesList[y];
						enemyPieces.push(thisEnemyPiece);
					}

					serverActions[0] = {
						type: CONSTANTS.EVENT_BATTLE,
						payload: {
							friendlyPieces,
							enemyPieces
						}
					};
					break;
				default:
					//this would never happen (hopefully)
					console.log("default unknown event type! (this should not have happened...)");
					return;
			}
		} else {
			//send the client that they are waiting for the next move? (need to change status?)
			serverActions[0] = {
				type: CONSTANTS.NO_MORE_EVENTS,
				payload: {} //don't need this...
			};
		}

		gameEvents[1] = await Event.getNext(gameId, 1);
		if (gameEvents[1]) {
			const type = gameEvents[1].eventTypeId;

			//TODO: duplicate code everywhere, refactor this (DRY)
			switch (type) {
				case 0:
					//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

					friendlyPiecesList = await gameEvents[1].getTeamItems(1);
					enemyPiecesList = await gameEvents[1].getTeamItems(0);
					friendlyPieces = [];
					enemyPieces = [];

					for (let x = 0; x < friendlyPiecesList.length; x++) {
						//need to transform pieces and stuff...
						let thisFriendlyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisFriendlyPiece.piece = friendlyPiecesList[x];
						friendlyPieces.push(thisFriendlyPiece);
					}

					for (let y = 0; y < enemyPiecesList.length; y++) {
						let thisEnemyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisEnemyPiece.piece = enemyPiecesList[y];
						enemyPieces.push(thisEnemyPiece);
					}

					serverActions[1] = {
						type: CONSTANTS.EVENT_BATTLE,
						payload: {
							friendlyPieces,
							enemyPieces
						}
					};
					break;
				case 1:
					//TODO: make the type part of a constant array and access it from there...(and keep the eventItems standard...and let client figure out what to do next...)

					friendlyPiecesList = await gameEvents[1].getTeamItems(1);
					enemyPiecesList = await gameEvents[1].getTeamItems(0);
					friendlyPieces = [];
					enemyPieces = [];

					for (let x = 0; x < friendlyPiecesList.length; x++) {
						//need to transform pieces and stuff...
						let thisFriendlyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisFriendlyPiece.piece = friendlyPiecesList[x];
						friendlyPieces.push(thisFriendlyPiece);
					}

					for (let y = 0; y < enemyPiecesList.length; y++) {
						let thisEnemyPiece = {
							targetPiece: null,
							targetPieceIndex: -1
						};
						thisEnemyPiece.piece = enemyPiecesList[y];
						enemyPieces.push(thisEnemyPiece);
					}

					serverActions[1] = {
						type: CONSTANTS.EVENT_BATTLE,
						payload: {
							friendlyPieces,
							enemyPieces
						}
					};
					break;
				default:
					//this would never happen (famous last words)
					return;
			}
		} else {
			serverActions[1] = {
				type: CONSTANTS.NO_MORE_EVENTS,
				payload: {} //don't need this...
			};
		}

		io.sockets.in("game" + gameId + "team0").emit("serverSendingAction", serverActions[0]);
		io.sockets.in("game" + gameId + "team1").emit("serverSendingAction", serverActions[1]);
	}
};

//Exposed / Exported Functions
exports.gameReset = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.status(403).redirect("/index.html?error=access");
		return;
	}

	const { gameId } = req.session.ir3;

	try {
		const thisGame = await new Game({ gameId }).init();
		if (!thisGame) {
			res.status(500).redirect("/teacher.html?gameReset=failed");
			return;
		}
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
		res.redirect(`/index.html?error=${CONSTANTS.BAD_REQUEST_TAG}`);
		return;
	}

	const inputPasswordHash = md5(adminPassword);
	if (adminSection == "CourseDirector" && adminInstructor == CourseDirectorLastName && inputPasswordHash == CourseDirectorPasswordHash) {
		req.session.ir3 = { courseDirector: true };
		res.redirect("/courseDirector.html");
		return;
	}

	try {
		const thisGame = await new Game({ gameSection: adminSection, gameInstructor: adminInstructor }).init();

		if (!thisGame) {
			res.redirect(`/index.html?error=${CONSTANTS.GAME_DOES_NOT_EXIST}`);
			return;
		}

		if (thisGame["gameAdminPassword"] != inputPasswordHash) {
			res.redirect(`/index.html?error=${CONSTANTS.LOGIN_TAG}`);
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
		res.status(500).redirect(`/index.html?error=${CONSTANTS.DATABASE_TAG}`);
	}
};

exports.gameLoginVerify = async (req, res) => {
	const { gameSection, gameInstructor, gameTeam, gameTeamPassword, gameController } = req.body;

	if (!gameSection || !gameInstructor || !gameTeam || !gameTeamPassword || !gameController) {
		res.redirect(`/index.html?error=${CONSTANTS.BAD_REQUEST_TAG}`);
		return;
	}

	const inputPasswordHash = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password

	try {
		const thisGame = await new Game({ gameSection, gameInstructor }).init();

		if (!thisGame) {
			res.redirect(`/index.html?error=${CONSTANTS.GAME_DOES_NOT_EXIST}`);
			return;
		}

		if (thisGame["gameActive"] != 1) {
			res.redirect(`/index.html?error=${CONSTANTS.GAME_INACTIVE_TAG}`);
		} else if (thisGame[commanderLoginField] != 0) {
			res.redirect(`/index.html?error=${CONSTANTS.ALREADY_IN_TAG}`);
		} else if (inputPasswordHash != thisGame[passwordHashToCheck]) {
			res.redirect(`/index.html?error=${CONSTANTS.LOGIN_TAG}`);
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
		res.status(500).redirect(`./index.html?error=${CONSTANTS.DATABASE_TAG}`);
	}
};

exports.getGames = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(`/index.html?error=${CONSTANTS.ACCESS_TAG}`);
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
		const thisGame = await new Game({ gameId }).init();

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
		const thisGame = await new Game({ gameId }).init();
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
		res.redirect(`/index.html?error=${CONSTANTS.BAD_SESSION}`);
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
		res.redirect(403, `/index.html?error=${CONSTANTS.ACCESS_TAG}`);
		return;
	}

	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		//TODO: better errors on CD (could have same as index) (status?)
		res.redirect(`/index.html?error=${CONSTANTS.BAD_REQUEST_TAG}`);
		return;
	}

	try {
		const adminPasswordHashed = md5(adminPassword);

		//TODO: validate inputs are within limits of database (4 characters for section....etc)

		const thisGame = await Game.add(adminSection, adminInstructor, adminPasswordHashed);

		if (!thisGame) {
			res.redirect("/courseDirector.html?gameAdd=failed");
		} else {
			res.redirect("/courseDirector.html?gameAdd=success");
		}
	} catch (error) {
		//TODO: (more specific errors on CD) (on other functions too)
		console.log(error);
		res.redirect(500, "/courseDirector.html?gameAdd=failed");
	}
};

exports.gameDelete = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.status(403).redirect(`/index.html?error=${CONSTANTS.ACCESS_TAG}`);
		return;
	}

	//TODO: delete all sockets assosiated with the game that was deleted?
	//send socket redirect? (if they were still on the game...prevent bad sessions from existing (extra protection from forgetting validation checks))

	const { gameId } = req.body;
	if (!gameId) {
		res.status(400).redirect("/courseDirector.html?gameDelete=failed");
		return;
	}

	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		res.status(400).redirect("/courseDirector.html?gameDelete=failed");
		return;
	}

	try {
		await thisGame.delete();
		res.redirect("/courseDirector.html?gameDelete=success");
	} catch (error) {
		console.log(error);
		res.status(500).redirect("/courseDirector.html?gameDelete=failed");
	}
};

exports.socketSetup = async (io, socket) => {
	if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
		socket.emit("serverRedirect", CONSTANTS.BAD_SESSION);
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
	const thisGame = await new Game({ gameId }).init();
	const action = await thisGame.initialStateAction(gameTeam, gameController);
	socket.emit("serverSendingAction", action);

	//TODO: reflect that the argument is a payload, change these to be objects that the server is receiving for continuity
	socket.on("shopPurchaseRequest", shopItemTypeId => {
		try {
			shopPurchaseRequest(socket, shopItemTypeId);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("shopRefundRequest", shopItem => {
		try {
			shopRefundRequest(socket, shopItem);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("shopConfirmPurchase", () => {
		try {
			shopConfirmPurchase(socket);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("confirmPlan", payload => {
		const { pieceId, plan } = payload;

		try {
			confirmPlan(socket, pieceId, plan);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("deletePlan", payload => {
		const { pieceId } = payload;

		try {
			deletePlan(socket, pieceId);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("mainButtonClick", () => {
		try {
			mainButtonClick(io, socket);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("piecePlace", payload => {
		try {
			const { invItemId, selectedPosition } = payload;
			piecePlace(io, socket, invItemId, selectedPosition);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("confirmBattleSelection", payload => {
		try {
			const { friendlyPieces } = payload;
			confirmBattleSelection(io, socket, friendlyPieces);
		} catch (error) {
			console.log(error);
			sendUserFeedback(socket, "INTERNAL SERVER ERROR: CHECK DATABASE");
		}
	});

	socket.on("disconnect", async () => {
		const { gameId, gameTeam, gameController } = socket.handshake.session.ir3; //Assume we have this, if this method is ever called (from sockets)
		const thisGame = await new Game({ gameId }).init();
		if (thisGame) {
			try {
				await thisGame.setLoggedIn(gameTeam, gameController, 0);
			} catch (error) {
				console.log(error);
			}
		}
	});
};
