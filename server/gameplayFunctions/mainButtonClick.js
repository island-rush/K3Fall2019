const sendUserFeedback = require("./sendUserFeedback");
const { Game, Capability } = require("../classes");
import { MAIN_BUTTON_CLICK, PURCHASE_PHASE, COMBAT_PHASE, NEWS_PHASE, SLICE_CHANGE } from "../../client/src/redux/actions/actionTypes";
import { SERVER_SENDING_ACTION, SERVER_REDIRECT } from "../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG } from "../pages/errorTypes";
import { BLUE_TEAM_ID, RED_TEAM_ID } from "../../client/src/gameData/gameConstants";
const executeStep = require("./executeStep"); //big function

const mainButtonClick = async (socket, payload) => {
    const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

    const thisGame = await new Game({ gameId }).init();
    const { gameActive, gamePhase, gameRound, gameSlice, game0Status, game1Status } = thisGame;

    if (!gameActive) {
        socket.emit(SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //Who is allowed to press that button?
    if (gameController != 0) {
        sendUserFeedback(socket, "Wrong Controller to click that button...");
        return;
    }

    const otherTeam = gameTeam == 0 ? 1 : 0;
    const thisTeamStatus = gameTeam == 0 ? game0Status : game1Status;
    const otherTeamStatus = otherTeam == 0 ? game0Status : game1Status;

    //Still Waiting
    if (thisTeamStatus == 1) {
        //might fail with race condition (they press at the same time...but they just need to keep pressing...)
        sendUserFeedback(socket, "Still waiting on other team...");
        return;
    }

    //Now Waiting
    if (otherTeamStatus == 0) {
        await thisGame.setStatus(gameTeam, 1);
        let serverAction = {
            type: MAIN_BUTTON_CLICK,
            payload: {}
        };
        socket.emit(SERVER_SENDING_ACTION, serverAction);
        return;
    }

    await thisGame.setStatus(otherTeam, 0);
    await thisGame.setStatus(gameTeam, 0);

    let serverAction0;
    let serverAction1;

    switch (gamePhase) {
        //News -> Purchase
        case 0:
            await thisGame.setPhase(1);
            serverAction0 = {
                type: PURCHASE_PHASE,
                payload: {}
            };
            serverAction1 = {
                type: PURCHASE_PHASE,
                payload: {}
            };
            break;

        //Purchase -> Combat
        case 1:
            await thisGame.setPhase(2);
            serverAction0 = {
                type: COMBAT_PHASE,
                payload: {}
            };
            serverAction1 = {
                type: COMBAT_PHASE,
                payload: {}
            };
            break;

        //Combat Phase -> Slice, Round, Place Troops... (stepping through)
        case 2:
            if (gameSlice == 0) {
                await thisGame.setSlice(1);

                //TODO: change payload to reflect what's being sent (confirmedRods = list of positions, confirmedInsurgency = list of pieces to delete)
                const confirmedRods = await Capability.useRodsFromGod(gameId);
                const confirmedBioWeapons = await Capability.useBiologicalWeapons(gameId);
                const confirmedGoldenEye = await Capability.useGoldenEye(gameId);
                const confirmedCommInterrupt = await Capability.useCommInterrupt(gameId);
                const { listOfPiecesToKill, listOfEffectedPositions } = await Capability.useInsurgency(gameId);

                serverAction0 = {
                    type: SLICE_CHANGE,
                    payload: {
                        confirmedRods,
                        confirmedBioWeapons,
                        confirmedGoldenEye,
                        confirmedCommInterrupt,
                        confirmedInsurgencyPos: listOfEffectedPositions,
                        confirmedInsurgencyPieces: listOfPiecesToKill
                    }
                };
                serverAction1 = {
                    type: SLICE_CHANGE,
                    payload: {
                        confirmedRods,
                        confirmedBioWeapons,
                        confirmedGoldenEye,
                        confirmedCommInterrupt,
                        confirmedInsurgencyPos: listOfEffectedPositions,
                        confirmedInsurgencyPieces: listOfPiecesToKill
                    }
                };
            } else {
                await executeStep(socket, thisGame);
                return; //executeStep will handle sending socket stuff, most likely separate for each client
            }
            break;

        //Place Troops -> News
        case 3:
            await thisGame.addPoints();
            await thisGame.setPhase(0);
            const news = await thisGame.getNextNews();
            serverAction0 = {
                type: NEWS_PHASE,
                payload: {
                    news,
                    gamePoints: thisGame.game0Points
                }
            };
            serverAction1 = {
                type: NEWS_PHASE,
                payload: {
                    news,
                    gamePoints: thisGame.game1Points
                }
            };
            break;

        default:
            sendUserFeedback(socket, "Backend Failure, unkown gamePhase...");
            return;
    }

    //Send to all clients (could be different from getting points)
    socket.to("game" + gameId + "team" + BLUE_TEAM_ID).emit(SERVER_SENDING_ACTION, serverAction0);
    socket.to("game" + gameId + "team" + RED_TEAM_ID).emit(SERVER_SENDING_ACTION, serverAction1);
    socket.emit(SERVER_SENDING_ACTION, gameTeam === BLUE_TEAM_ID ? serverAction0 : serverAction1);
};

module.exports = mainButtonClick;
