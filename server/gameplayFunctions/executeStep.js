const { Plan, Piece, Event } = require("../classes");
import { PLACE_PHASE, NEW_ROUND } from "../../client/src/redux/actions/actionTypes";
const giveNextEvent = require("./giveNextEvent");

const executeStep = async (socket, thisGame) => {
	//inserting events here and moving pieces, or changing to new round or something...
	const { gameId, gameRound } = thisGame;

	const currentMovementOrder0 = await Plan.getCurrentMovementOrder(gameId, 0);
	const currentMovementOrder1 = await Plan.getCurrentMovementOrder(gameId, 1);

	//No More Plans for either team
	//DOESN'T MAKE PLANS FOR PIECES STILL IN THE SAME POSITION...NEED TO HAVE AT LEAST 1 PLAN FOR ANYTHING TO HAPPEN (pieces in same postion would battle (again?) if there was 1 plan elsewhere...)
	if (currentMovementOrder0 == null && currentMovementOrder1 == null) {
		await thisGame.setSlice(0); //if no more moves, end of slice 1

		let serverAction;
		if (gameRound == 2) {
			await thisGame.setRound(0);
			await thisGame.setPhase(3);

			//Combat -> Place Phase
			serverAction = {
				type: PLACE_PHASE,
				payload: {}
			};
		} else {
			await thisGame.setRound(gameRound + 1);

			serverAction = {
				type: NEW_ROUND,
				payload: {
					gameRound: thisGame.gameRound
				}
			};
		}

		socket.to("game" + gameId).emit("serverSendingAction", serverAction);
		socket.emit("serverSendingAction", serverAction);
		return;
	}

	//One of the teams may be without plans, keep them waiting (//TODO: possible refactor to prevent undoing their status in the 1st place (would probably be complex...))
	if (currentMovementOrder0 == null) {
		await thisGame.setStatus(0, 1);
	}
	if (currentMovementOrder1 == null) {
		await thisGame.setStatus(1, 1);
	}

	let currentMovementOrder = currentMovementOrder0 != null ? currentMovementOrder0 : currentMovementOrder1;

	//Collision Battle Events
	const allCollisions = await Plan.getCollisions(gameId, currentMovementOrder); //each item in collisionBattles has {pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 }
	if (allCollisions.length > 0) {
		let allCollideEvents = {}; //'position0-position1' => [piecesInvolved]

		for (let x = 0; x < allCollisions.length; x++) {
			let { pieceId0, piecePositionId0, planPositionId0, pieceId1 } = allCollisions[x];

			//TODO: figure out if these 2 pieces would actually collide / battle
			//consider visibility

			let thisEventPositions = `${piecePositionId0}-${planPositionId0}`;
			if (!Object.keys(allCollideEvents).includes(thisEventPositions)) allCollideEvents[thisEventPositions] = [];
			if (!allCollideEvents[thisEventPositions].includes(pieceId0)) allCollideEvents[thisEventPositions].push(pieceId0);
			if (!allCollideEvents[thisEventPositions].includes(pieceId1)) allCollideEvents[thisEventPositions].push(pieceId1);
		}

		const bothTeamsIndicator = 2; //could be a constant...
		const collisionEventType = 0; //should be a constant...//TODO: make constant...

		let eventInserts = [];
		let eventItemInserts = [];
		let keys = Object.keys(allCollideEvents);
		for (let b = 0; b < keys.length; b++) {
			let key = keys[b];
			eventInserts.push([gameId, bothTeamsIndicator, collisionEventType, key.split("-")[0], key.split("-")[1]]);
			let eventPieces = allCollideEvents[key];
			for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key.split("-")[0], key.split("-")[1]]);
		}

		await Event.bulkInsertEvents(eventInserts);
		await Event.bulkInsertItems(gameId, eventItemInserts);
	}

	await Piece.move(gameId, currentMovementOrder); //changes the piecePositionId, deletes the plan, all for specialflag = 0
	await Piece.updateVisibilities(gameId);

	//Position Battle Events
	const allPositionCombinations = await Plan.getPositionCombinations(gameId);
	if (allPositionCombinations.length > 0) {
		let allPosEvents = {};
		for (let x = 0; x < allPositionCombinations.length; x++) {
			let { pieceId0, piecePositionId0, pieceId1 } = allPositionCombinations[x];

			//TODO: figure out if these 2 pieces would actually collide / battle
			//consider visibility

			let thisEventPosition = `${piecePositionId0}`;
			if (!Object.keys(allPosEvents).includes(thisEventPosition)) allPosEvents[thisEventPosition] = [];
			if (!allPosEvents[thisEventPosition].includes(pieceId0)) allPosEvents[thisEventPosition].push(pieceId0);
			if (!allPosEvents[thisEventPosition].includes(pieceId1)) allPosEvents[thisEventPosition].push(pieceId1);
		}

		const bothTeamsIndicator = 2; //should be constants
		const posBattleEventType = 1; //should be constants

		let eventInserts = [];
		let eventItemInserts = [];
		let keys = Object.keys(allPosEvents);
		for (let b = 0; b < keys.length; b++) {
			let key = keys[b];
			eventInserts.push([gameId, bothTeamsIndicator, posBattleEventType, key, key]);
			let eventPieces = allPosEvents[key];
			for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key, key]);
		}

		await Event.bulkInsertEvents(eventInserts);
		await Event.bulkInsertItems(gameId, eventItemInserts);
	}

	// TODO: Refuel Events (special flag? / proximity) (check to see that the piece still exists!*!*) (still have plans from old pieces that used to exist? (but those would delete on cascade probaby...except the events themselves...))
	// TODO: Container Events (special flag)

	// Note: All non-move (specialflag != 0) plans should result in events (refuel/container)...
	// If there is now an event, send to user instead of PIECES_MOVE

	await giveNextEvent(socket, { thisGame, executingStep: true });
};

module.exports = executeStep;
