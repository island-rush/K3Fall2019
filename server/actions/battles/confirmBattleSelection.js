const { Game, Event } = require("../../classes");
import { BATTLE_FIGHT_RESULTS, UPDATE_FLAGS } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/constants/otherConstants";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { BLUE_TEAM_ID, RED_TEAM_ID, WAITING_STATUS, NOT_WAITING_STATUS, TYPE_MAIN, COMBAT_PHASE_ID } from "../../../client/src/constants/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");
const giveNextEvent = require("../giveNextEvent");

const confirmBattleSelection = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const { friendlyPieces } = payload;

    const thisGame = await new Game({ gameId }).init();
    const { gameActive, gamePhase, game0Status, game1Status } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase for battle selections.");
        return;
    }

    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Need to be air commander.");
        return;
    }

    const otherTeam = gameTeam == BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
    const thisTeamStatus = gameTeam == BLUE_TEAM_ID ? game0Status : game1Status;
    const otherTeamStatus = otherTeam == BLUE_TEAM_ID ? game0Status : game1Status;

    if (thisTeamStatus == WAITING_STATUS && otherTeamStatus == NOT_WAITING_STATUS) {
        sendUserFeedback(socket, "still waiting stupid...");
        return;
    }

    //confirm the selections
    const thisTeamsCurrentEvent = await Event.getNext(gameId, gameTeam);
    await thisTeamsCurrentEvent.bulkUpdateTargets(friendlyPieces);

    //are we waiting for the other client?
    //and if thisTeamStatus == NOT_WAITING....(maybe make explicit here <-TODO:
    if (otherTeamStatus == NOT_WAITING_STATUS) {
        await thisGame.setStatus(gameTeam, WAITING_STATUS);
        sendUserFeedback(socket, "confirmed, now waiting on other team...");
        return;
    }

    //if get here, other team was already waiting, need to set them to 0 and handle stuff
    await thisGame.setStatus(otherTeam, NOT_WAITING_STATUS);

    //Do the fight!
    const fightResults = await thisTeamsCurrentEvent.fight();

    if (fightResults.atLeastOneBattle) {
        const serverAction = {
            type: BATTLE_FIGHT_RESULTS,
            payload: {
                masterRecord: fightResults.masterRecord
            }
        };

        socket.to("game" + gameId).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
        return;
    }

    await thisTeamsCurrentEvent.delete();

    const didUpdateFlags = await thisGame.updateFlags();
    if (didUpdateFlags) {
        const updateFlagAction = {
            type: UPDATE_FLAGS,
            payload: {
                flag0: thisGame.flag0,
                flag1: thisGame.flag1,
                flag2: thisGame.flag2,
                flag3: thisGame.flag3,
                flag4: thisGame.flag4,
                flag5: thisGame.flag5,
                flag6: thisGame.flag6,
                flag7: thisGame.flag7,
                flag8: thisGame.flag8,
                flag9: thisGame.flag9,
                flag10: thisGame.flag10,
                flag11: thisGame.flag11,
                flag12: thisGame.flag12
            }
        };
        socket.to("game" + gameId).emit(SOCKET_SERVER_SENDING_ACTION, updateFlagAction);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, updateFlagAction);
    }

    await giveNextEvent(socket, { thisGame, gameTeam: 0 }); //not putting executingStep in options to let it know not to send pieceMove
    await giveNextEvent(socket, { thisGame, gameTeam: 1 }); //not putting executingStep in options to let it know not to send pieceMove
};

module.exports = confirmBattleSelection;
