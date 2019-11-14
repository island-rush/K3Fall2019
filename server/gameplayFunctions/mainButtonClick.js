const sendUserFeedback = require("./sendUserFeedback");
const { Game, Capability } = require("../classes");
import { MAIN_BUTTON_CLICK, PURCHASE_PHASE, COMBAT_PHASE, NEWS_PHASE, SLICE_CHANGE } from "../../client/src/redux/actions/actionTypes";
import { SERVER_SENDING_ACTION, SERVER_REDIRECT } from "../../client/src/redux/socketEmits";
import { GAME_INACTIVE_TAG } from "../pages/errorTypes";
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

    let serverAction;

    switch (gamePhase) {
        //News -> Purchase
        case 0:
            await thisGame.setPhase(1);
            serverAction = {
                type: PURCHASE_PHASE,
                payload: {}
            };
            break;

        //Purchase -> Combat
        case 1:
            await thisGame.setPhase(2);
            serverAction = {
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
                const confirmedCommInterrupt = await Capability.useCommInterrupt(gameId);
                const { listOfPiecesToKill, listOfEffectedPositions } = await Capability.useInsurgency(gameId);

                serverAction = {
                    type: SLICE_CHANGE,
                    payload: {
                        confirmedRods,
                        confirmedBioWeapons,
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
            await thisGame.setPhase(0);
            const news = await thisGame.getNextNews();
            serverAction = {
                type: NEWS_PHASE,
                payload: {
                    news
                }
            };
            break;

        default:
            sendUserFeedback(socket, "Backend Failure, unkown gamePhase...");
            return;
    }

    //Send to all clients
    socket.to("game" + gameId).emit(SERVER_SENDING_ACTION, serverAction);
    socket.emit(SERVER_SENDING_ACTION, serverAction);
};

module.exports = mainButtonClick;
