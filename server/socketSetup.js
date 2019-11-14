/**
 * Setting up server-side web sockets
 * Importing the gameplay functions and responding to client 'actions'
 */

const { Game } = require("./classes");
import { BAD_SESSION, GAME_DOES_NOT_EXIST, NOT_LOGGED_IN_TAG } from "./pages/errorTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION, CLIENT_SENDING_ACTION } from "../client/src/redux/socketEmits";
import {
    SERVER_BIOLOGICAL_WEAPONS_CONFIRM,
    SERVER_INSURGENCY_CONFIRM,
    SERVER_REMOTE_SENSING_CONFIRM,
    SERVER_RODS_FROM_GOD_CONFIRM,
    SERVER_CONFIRM_FUEL_SELECTION,
    SERVER_CONFIRM_BATTLE_SELECTION,
    SERVER_MAIN_BUTTON_CLICK,
    SERVER_PIECE_PLACE,
    SERVER_DELETE_PLAN,
    SERVER_CONFIRM_PLAN,
    SERVER_SHOP_CONFIRM_PURCHASE,
    SERVER_SHOP_REFUND_REQUEST,
    SERVER_SHOP_PURCHASE_REQUEST,
    SERVER_RAISE_MORALE_CONFIRM,
    SERVER_COMM_INTERRUPT_CONFIRM,
    SERVER_GOLDEN_EYE_CONFIRM
} from "../client/src/redux/actions/actionTypes";
const {
    sendUserFeedback,
    shopPurchaseRequest,
    shopRefundRequest,
    shopConfirmPurchase,
    confirmPlan,
    deletePlan,
    piecePlace,
    mainButtonClick,
    confirmBattleSelection,
    confirmFuelSelection,
    rodsFromGodConfirm,
    remoteSensingConfirm,
    insurgencyConfirm,
    biologicalWeaponsConfirm,
    raiseMoraleConfirm,
    commInterruptConfirm,
    goldenEyeConfirm
} = require("./gameplayFunctions");

const socketSetup = async socket => {
    //Verify that this user is authenticated / known
    if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameController) {
        socket.emit(SERVER_REDIRECT, BAD_SESSION);
        return;
    }

    const ir3Session = socket.handshake.session.ir3;
    const { gameId, gameTeam, gameController } = ir3Session; //get the user's information

    const thisGame = await new Game({ gameId }).init(); //get the Game

    if (!thisGame) {
        //unlikely, since we just came from gameLogin successfully
        socket.emit(SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const loggedIn = thisGame["game" + gameTeam + "Controller" + gameController];

    //Session doesn't match DB, another player could login again as this controller (since login only checks db values)
    if (!loggedIn) {
        socket.emit(SERVER_REDIRECT, NOT_LOGGED_IN_TAG);
        return;
    } else {
        //probably refreshed, keep them logged in (disconnect logs them out)
        setTimeout(() => {
            thisGame.setLoggedIn(gameTeam, gameController, 1);
            socket.handshake.session.ir3 = ir3Session;
        }, 5000);
    }

    //Socket Room for the Game
    socket.join("game" + gameId);

    //Socket Room for the Team
    socket.join("game" + gameId + "team" + gameTeam);

    //Socket Room for the Indiviual Controller
    socket.join("game" + gameId + "team" + gameTeam + "controller" + gameController);

    //Send the client intial game state data
    const serverAction = await thisGame.initialStateAction(gameTeam, gameController);
    socket.emit(SERVER_SENDING_ACTION, serverAction); //sends the data

    //Setup the socket functions to respond to client requests
    socket.on(CLIENT_SENDING_ACTION, ({ type, payload }) => {
        try {
            switch (type) {
                case SERVER_SHOP_PURCHASE_REQUEST:
                    shopPurchaseRequest(socket, payload);
                    break;
                case SERVER_SHOP_REFUND_REQUEST:
                    shopRefundRequest(socket, payload);
                    break;
                case SERVER_SHOP_CONFIRM_PURCHASE:
                    shopConfirmPurchase(socket, payload);
                    break;
                case SERVER_CONFIRM_PLAN:
                    confirmPlan(socket, payload);
                    break;
                case SERVER_DELETE_PLAN:
                    deletePlan(socket, payload);
                    break;
                case SERVER_PIECE_PLACE:
                    piecePlace(socket, payload);
                    break;
                case SERVER_MAIN_BUTTON_CLICK:
                    mainButtonClick(socket, payload);
                    break;
                case SERVER_CONFIRM_BATTLE_SELECTION:
                    confirmBattleSelection(socket, payload);
                    break;
                case SERVER_CONFIRM_FUEL_SELECTION:
                    confirmFuelSelection(socket, payload);
                    break;
                case SERVER_RODS_FROM_GOD_CONFIRM:
                    rodsFromGodConfirm(socket, payload);
                    break;
                case SERVER_REMOTE_SENSING_CONFIRM:
                    remoteSensingConfirm(socket, payload);
                    break;
                case SERVER_INSURGENCY_CONFIRM:
                    insurgencyConfirm(socket, payload);
                    break;
                case SERVER_BIOLOGICAL_WEAPONS_CONFIRM:
                    biologicalWeaponsConfirm(socket, payload);
                    break;
                case SERVER_RAISE_MORALE_CONFIRM:
                    raiseMoraleConfirm(socket, payload);
                    break;
                case SERVER_COMM_INTERRUPT_CONFIRM:
                    commInterruptConfirm(socket, payload);
                    break;
                case SERVER_GOLDEN_EYE_CONFIRM:
                    goldenEyeConfirm(socket, payload);
                    break;
                default:
                    sendUserFeedback(socket, "Did not recognize client socket request type");
            }
        } catch (error) {
            console.error(error);
            sendUserFeedback(socket, `INTERNAL SERVER ERROR: CHECK DATABASE -> error: ${error}`);
        }
    });

    //Automatically Logout this person (from database) when their socket disconnects from the server
    socket.on("disconnect", async () => {
        try {
            setTimeout(() => {
                thisGame.setLoggedIn(gameTeam, gameController, 0);
                delete socket.handshake.session.ir3;
            }, 5000);
        } catch (error) {
            //TODO: log errors to a file (for production/deployment reasons)
            console.error(error);
        }
    });
};

module.exports = socketSetup;
