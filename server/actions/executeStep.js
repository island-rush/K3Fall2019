const { Plan, Piece, Event, Capability } = require("../classes");
import { PLACE_PHASE, NEW_ROUND, PIECES_MOVE, UPDATE_FLAGS } from "../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_SENDING_ACTION, SOCKET_SERVER_REDIRECT } from "../../client/src/constants/otherConstants";
import { BLUE_TEAM_ID, RED_TEAM_ID, PLACE_PHASE_ID, WAITING_STATUS } from "../../client/src/constants/gameConstants";
const giveNextEvent = require("./giveNextEvent");
const { BOTH_TEAMS_INDICATOR, POS_BATTLE_EVENT_TYPE, COL_BATTLE_EVENT_TYPE, REFUEL_EVENT_TYPE } = require("./eventConstants");

const executeStep = async (socket, thisGame) => {
    //inserting events here and moving pieces, or changing to new round or something...
    const { gameId, gameRound } = thisGame;

    //TODO: rename this to 'hadPlans0' or something more descriptive
    const currentMovementOrder0 = await Plan.getCurrentMovementOrder(gameId, BLUE_TEAM_ID);
    const currentMovementOrder1 = await Plan.getCurrentMovementOrder(gameId, RED_TEAM_ID);

    //No More Plans for either team
    //DOESN'T MAKE PLANS FOR PIECES STILL IN THE SAME POSITION...NEED TO HAVE AT LEAST 1 PLAN FOR ANYTHING TO HAPPEN (pieces in same postion would battle (again?) if there was 1 plan elsewhere...)
    if (currentMovementOrder0 == null && currentMovementOrder1 == null) {
        await thisGame.setSlice(0); //if no more moves, end of slice 1

        await Piece.resetMoves(gameId); //TODO: could move this functionality to Game (no need to pass in the gameId)

        //Decrease game effects that last for x rounds
        await Capability.decreaseRemoteSensing(gameId);
        await Capability.decreaseBiologicalWeapons(gameId);
        await Capability.decreaseGoldenEye(gameId);
        await Capability.decreaseCommInterrupt(gameId);
        await Capability.decreaseRaiseMorale(gameId);

        const gameboardPiecesList0 = await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID);
        const gameboardPiecesList1 = await Piece.getVisiblePieces(gameId, RED_TEAM_ID);

        const remoteSense0 = await Capability.getRemoteSensing(gameId, BLUE_TEAM_ID);
        const remoteSense1 = await Capability.getRemoteSensing(gameId, RED_TEAM_ID);

        const bioWeapons0 = await Capability.getBiologicalWeapons(gameId, BLUE_TEAM_ID); //any team should work, since all activated at this point?
        const bioWeapons1 = await Capability.getBiologicalWeapons(gameId, RED_TEAM_ID);

        const raiseMorale0 = await Capability.getRaiseMorale(gameId, BLUE_TEAM_ID);
        const raiseMorale1 = await Capability.getRaiseMorale(gameId, RED_TEAM_ID);

        const commInterrupt0 = await Capability.getCommInterrupt(gameId, BLUE_TEAM_ID);
        const commInterrupt1 = await Capability.getCommInterrupt(gameId, RED_TEAM_ID);

        const goldenEye0 = await Capability.getGoldenEye(gameId, BLUE_TEAM_ID);
        const goldenEye1 = await Capability.getGoldenEye(gameId, RED_TEAM_ID);

        let serverAction0;
        let serverAction1;
        //TODO: could do constant with 'ROUNDS_PER_COMBAT' although getting excessive
        if (gameRound == 2) {
            //Combat -> Place Phase
            await thisGame.setRound(0);
            await thisGame.setPhase(PLACE_PHASE_ID);

            serverAction0 = {
                type: PLACE_PHASE,
                payload: {
                    gameboardPieces: gameboardPiecesList0,
                    confirmedRemoteSense: remoteSense0,
                    confirmedBioWeapons: bioWeapons0,
                    confirmedRaiseMorale: raiseMorale0,
                    confirmedCommInterrupt: commInterrupt0,
                    confirmedGoldenEye: goldenEye0
                }
            };

            serverAction1 = {
                type: PLACE_PHASE,
                payload: {
                    gameboardPieces: gameboardPiecesList1,
                    confirmedRemoteSense: remoteSense1,
                    confirmedBioWeapons: bioWeapons1,
                    confirmedRaiseMorale: raiseMorale1,
                    confirmedCommInterrupt: commInterrupt1,
                    confirmedGoldenEye: goldenEye1
                }
            };
        } else {
            //Next Round of Combat
            await thisGame.setRound(gameRound + 1);

            serverAction0 = {
                type: NEW_ROUND,
                payload: {
                    gameRound: thisGame.gameRound,
                    gameboardPieces: gameboardPiecesList0,
                    confirmedRemoteSense: remoteSense0,
                    confirmedBioWeapons: bioWeapons0,
                    confirmedRaiseMorale: raiseMorale0,
                    confirmedCommInterrupt: commInterrupt0,
                    confirmedGoldenEye: goldenEye0
                }
            };

            serverAction1 = {
                type: NEW_ROUND,
                payload: {
                    gameRound: thisGame.gameRound,
                    gameboardPieces: gameboardPiecesList1,
                    confirmedRemoteSense: remoteSense1,
                    confirmedBioWeapons: bioWeapons1,
                    confirmedRaiseMorale: raiseMorale1,
                    confirmedCommInterrupt: commInterrupt1,
                    confirmedGoldenEye: goldenEye1
                }
            };
        }

        socket.to("game" + gameId + "team0").emit(SOCKET_SERVER_SENDING_ACTION, serverAction0);
        socket.to("game" + gameId + "team1").emit(SOCKET_SERVER_SENDING_ACTION, serverAction1);

        const thisSocketsAction = parseInt(socket.handshake.session.ir3.gameTeam) === BLUE_TEAM_ID ? serverAction0 : serverAction1;
        socket.emit(SOCKET_SERVER_SENDING_ACTION, thisSocketsAction);

        return;
    }

    //One of the teams may be without plans, keep them waiting
    if (currentMovementOrder0 == null) {
        await thisGame.setStatus(BLUE_TEAM_ID, WAITING_STATUS);
    }
    if (currentMovementOrder1 == null) {
        await thisGame.setStatus(RED_TEAM_ID, WAITING_STATUS);
    }

    let currentMovementOrder = currentMovementOrder0 != null ? currentMovementOrder0 : currentMovementOrder1;

    //Collision Battle Events
    const allCollisions = await Plan.getCollisions(gameId, currentMovementOrder); //each item in collisionBattles has {pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 }
    if (allCollisions.length > 0) {
        let allCollideEvents = {}; //'position0-position1' => [piecesInvolved]

        for (let x = 0; x < allCollisions.length; x++) {
            let { pieceId0, piecePositionId0, planPositionId0, pieceId1 } = allCollisions[x];

            //TODO: figure out if these 2 pieces would actually collide / battle (do the same for position battles)
            //consider visibility

            let thisEventPositions = `${piecePositionId0}-${planPositionId0}`;
            if (!Object.keys(allCollideEvents).includes(thisEventPositions)) allCollideEvents[thisEventPositions] = [];
            if (!allCollideEvents[thisEventPositions].includes(pieceId0)) allCollideEvents[thisEventPositions].push(pieceId0);
            if (!allCollideEvents[thisEventPositions].includes(pieceId1)) allCollideEvents[thisEventPositions].push(pieceId1);
        }

        let eventInserts = [];
        let eventItemInserts = [];
        let keys = Object.keys(allCollideEvents);
        for (let b = 0; b < keys.length; b++) {
            let key = keys[b];
            eventInserts.push([gameId, BOTH_TEAMS_INDICATOR, COL_BATTLE_EVENT_TYPE, key.split("-")[0], key.split("-")[1]]);
            let eventPieces = allCollideEvents[key];
            for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key.split("-")[0], key.split("-")[1]]);
        }

        await Event.bulkInsertEvents(eventInserts);
        await Event.bulkInsertItems(gameId, eventItemInserts);
    }

    await Piece.move(gameId, currentMovementOrder); //changes the piecePositionId, deletes the plan, all for specialflag = 0
    await Piece.updateVisibilities(gameId);

    const didUpdateFlags = await thisGame.updateFlags();
    if (didUpdateFlags) {
        const updateFlagAction = {
            type: UPDATE_FLAGS,
            payload: {
                island0: thisGame.island0,
                island1: thisGame.island1,
                island2: thisGame.island2,
                island3: thisGame.island3,
                island4: thisGame.island4,
                island5: thisGame.island5,
                island6: thisGame.island6,
                island7: thisGame.island7,
                island8: thisGame.island8,
                island9: thisGame.island9,
                island10: thisGame.island10,
                island11: thisGame.island11,
                island12: thisGame.island12
            }
        };
        socket.to("game" + gameId).emit(SOCKET_SERVER_SENDING_ACTION, updateFlagAction);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, updateFlagAction);
    }

    //Position Battle Events
    const allPositionCombinations = await Plan.getPositionCombinations(gameId);
    if (allPositionCombinations.length > 0) {
        let allPosEvents = {};
        for (let x = 0; x < allPositionCombinations.length; x++) {
            let { pieceId0, piecePositionId0, pieceId1 } = allPositionCombinations[x];

            //consider if they would fight (see collision)
            //consider visibility

            let thisEventPosition = `${piecePositionId0}`;
            if (!Object.keys(allPosEvents).includes(thisEventPosition)) allPosEvents[thisEventPosition] = [];
            if (!allPosEvents[thisEventPosition].includes(pieceId0)) allPosEvents[thisEventPosition].push(pieceId0);
            if (!allPosEvents[thisEventPosition].includes(pieceId1)) allPosEvents[thisEventPosition].push(pieceId1);
        }

        let eventInserts = [];
        let eventItemInserts = [];
        let keys = Object.keys(allPosEvents);
        for (let b = 0; b < keys.length; b++) {
            let key = keys[b];
            eventInserts.push([gameId, BOTH_TEAMS_INDICATOR, POS_BATTLE_EVENT_TYPE, key, key]);
            let eventPieces = allPosEvents[key];
            for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key, key]);
        }

        await Event.bulkInsertEvents(eventInserts);
        await Event.bulkInsertItems(gameId, eventItemInserts);
    }

    //should not do refuel events if the team didn't have any plans for this step (TODO: prevent refuel stuff for team specific things)

    //refueling is team specific (loop through 0 and 1 teamIds)
    //TODO: could refactor this to be cleaner (easier to read)
    const teamHadPlans = [currentMovementOrder0 == null ? 0 : 1, currentMovementOrder1 == null ? 0 : 1];
    for (let thisTeamNum = 0; thisTeamNum < 2; thisTeamNum++) {
        if (teamHadPlans[thisTeamNum]) {
            //refuel events if they had plans for this step, otherwise don't want to refuel stuff for no plans (possibly will do it anyway)
            //need to grab all refuel events from database, looking at pieces in the same positions
            let allPositionRefuels = await Piece.getPositionRefuels(gameId, thisTeamNum);
            if (allPositionRefuels.length > 0) {
                let allPosEvents = {};
                for (let x = 0; x < allPositionRefuels.length; x++) {
                    // tnkrPieceId, tnkrPieceTypeId, tnkrPiecePositionId, tnkrPieceMoves, tnkrPieceFuel, arcftPieceId, arcftPieceTypeId, arcftPiecePositionId, arcftPieceMoves, arcftPieceFuel
                    //prettier-ignore
                    let { tnkrPieceId, tnkrPiecePositionId, arcftPieceId } = allPositionRefuels[x];

                    let thisEventPosition = `${tnkrPiecePositionId}`;
                    if (!Object.keys(allPosEvents).includes(thisEventPosition)) allPosEvents[thisEventPosition] = [];
                    if (!allPosEvents[thisEventPosition].includes(tnkrPieceId)) allPosEvents[thisEventPosition].push(tnkrPieceId);
                    if (!allPosEvents[thisEventPosition].includes(arcftPieceId)) allPosEvents[thisEventPosition].push(arcftPieceId);
                }

                let eventInserts = [];
                let eventItemInserts = [];
                let keys = Object.keys(allPosEvents);
                for (let b = 0; b < keys.length; b++) {
                    let key = keys[b];
                    eventInserts.push([gameId, thisTeamNum, REFUEL_EVENT_TYPE, key, key]);
                    let eventPieces = allPosEvents[key];
                    for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key, key]);
                }

                await Event.bulkInsertEvents(eventInserts);
                await Event.bulkInsertItems(gameId, eventItemInserts);
            }
        }
    }

    // TODO: Container Events (special flag)

    // Note: All non-move (specialflag != 0) plans should result in events (refuel/container)...
    // If there is now an event, send to user instead of PIECES_MOVE

    await giveNextEvent(socket, { thisGame, executingStep: true, gameTeam: BLUE_TEAM_ID });
    await giveNextEvent(socket, { thisGame, executingStep: true, gameTeam: RED_TEAM_ID });
};

module.exports = executeStep;
