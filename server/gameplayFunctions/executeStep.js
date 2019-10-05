const { Plan, Piece, Event } = require("../classes");
const { PLACE_PHASE, NEW_ROUND, EVENT_BATTLE, NO_MORE_EVENTS, PIECES_MOVE } = require("../constants");

const executeStep = async (socket, thisGame) => {
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
				type: PLACE_PHASE,
				payload: {}
			};
			socket.to("game" + gameId).emit("serverSendingAction", serverAction);
			socket.emit("serverSendingAction", serverAction);
			return;
		} else {
			await thisGame.setRound(gameRound + 1);
			await thisGame.setSlice(0);

			serverAction = {
				type: NEW_ROUND,
				payload: {
					gameRound: thisGame.gameRound
				}
			};
			socket.to("game" + gameId).emit("serverSendingAction", serverAction);
			socket.emit("serverSendingAction", serverAction);
			return;
		}
	}

	//One of the teams may be without plans, keep them waiting
	let currentMovementOrder;
	if (currentMovementOrder0 == null) {
		await thisGame.setStatus(0, 1);
	} else {
		currentMovementOrder = currentMovementOrder0;
	}
	if (currentMovementOrder1 == null) {
		await thisGame.setStatus(1, 1);
	} else {
		currentMovementOrder = currentMovementOrder1;
	}

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
					type: EVENT_BATTLE,
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
					type: EVENT_BATTLE,
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
			type: NO_MORE_EVENTS,
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
					type: EVENT_BATTLE,
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
					type: EVENT_BATTLE,
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
			type: NO_MORE_EVENTS,
			payload: {} //don't need this...
		};
	}

	//sending the events that we got, or "no more events"? (but also sending piece moves after this...should combine...)
	socket.to("game" + gameId + "team0").emit("serverSendingAction", serverActions[0]);
	socket.to("game" + gameId + "team1").emit("serverSendingAction", serverActions[1]);
	const { gameTeam } = socket.handshake.session.ir3;
	socket.emit("serverSendingAction", serverActions[gameTeam]);

	//also send them the updated pieces anyways? //TODO: could send with first package, and avoid 2 requests (but need a special action type?)
	gameboardPiecesList = [await Piece.getVisiblePieces(gameId, 0), await Piece.getVisiblePieces(gameId, 1)];

	socket.to("game" + gameId + "team0").emit("serverSendingAction", {
		type: PIECES_MOVE,
		payload: {
			gameboardPieces: gameboardPiecesList[0],
			gameStatus: 0
		}
	});
	socket.to("game" + gameId + "team1").emit("serverSendingAction", {
		type: PIECES_MOVE,
		payload: {
			gameboardPieces: gameboardPiecesList[1],
			gameStatus: 0
		}
	});
	socket.emit("serverSendingAction", {
		type: PIECES_MOVE,
		payload: {
			gameboardPieces: gameboardPiecesList[gameTeam],
			gameStatus: 0
		}
	});
};

module.exports = executeStep;
