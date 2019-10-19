/**
 * Setting up server-side web sockets
 * Importing the gameplay functions and responding to client 'actions'
 */

const { Game } = require("./classes");
import { BAD_SESSION, GAME_DOES_NOT_EXIST, NOT_LOGGED_IN_TAG } from "./pages/errorTypes";
import { SERVER_REDIRECT, SERVER_SENDING_ACTION, CLIENT_SENDING_ACTION } from "../client/src/redux/socketEmits";
const {
	sendUserFeedback,
	shopPurchaseRequest,
	shopRefundRequest,
	shopConfirmPurchase,
	confirmPlan,
	deletePlan,
	piecePlace,
	mainButtonClick,
	confirmBattleSelection
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
				case "shopPurchaseRequest": //Could use constants, but only used once on frontend, once on backend
					shopPurchaseRequest(socket, payload);
					break;
				case "shopRefundRequest":
					shopRefundRequest(socket, payload);
					break;
				case "shopConfirmPurchase":
					shopConfirmPurchase(socket, payload);
					break;
				case "confirmPlan":
					confirmPlan(socket, payload);
					break;
				case "deletePlan":
					deletePlan(socket, payload);
					break;
				case "piecePlace":
					piecePlace(socket, payload);
					break;
				case "mainButtonClick":
					mainButtonClick(socket, payload);
					break;
				case "confirmBattleSelection":
					confirmBattleSelection(socket, payload);
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
