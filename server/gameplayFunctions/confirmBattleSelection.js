const { Game, Event } = require("../classes");
const { GAME_INACTIVE_TAG, BATTLE_FIGHT_RESULTS, EVENT_BATTLE, NO_MORE_EVENTS } = require("../constants");
const sendUserFeedback = require("./sendUserFeedback");

const confirmBattleSelection = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const { friendlyPieces } = payload;

	const thisGame = await new Game({ gameId }).init();
	const { gameActive, gamePhase, game0Status, game1Status } = thisGame;

	if (!gameActive) {
		socket.emit("serverRedirect", GAME_INACTIVE_TAG);
		return;
	}

	const thisTeamStatus = gameTeam == 0 ? game0Status : game1Status;
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
			type: BATTLE_FIGHT_RESULTS,
			payload: {
				masterRecord: fightResults.masterRecord
			}
		};

		socket.to("game" + gameId).emit("serverSendingAction", serverAction);
		socket.emit("serverSendingAction", serverAction);
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

		socket.to("game" + gameId + "team0").emit("serverSendingAction", serverActions[0]);
		socket.to("game" + gameId + "team1").emit("serverSendingAction", serverActions[1]);
		socket.emit("serverSendingAction", serverActions[gameTeam]);
	}
};

module.exports = confirmBattleSelection;
