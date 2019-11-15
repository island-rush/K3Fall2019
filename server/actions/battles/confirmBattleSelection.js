const { Game, Event } = require("../../classes");
import { BATTLE_FIGHT_RESULTS, UPDATE_FLAGS } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/gameData/otherConstants";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { BLUE_TEAM_ID, RED_TEAM_ID, WAITING_STATUS, NOT_WAITING_STATUS } from "../../../client/src/gameData/gameConstants";
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

    await giveNextEvent(socket, { thisGame, gameTeam: 0 }); //not putting executingStep in options to let it know not to send pieceMove
    await giveNextEvent(socket, { thisGame, gameTeam: 1 }); //not putting executingStep in options to let it know not to send pieceMove
};

module.exports = confirmBattleSelection;
