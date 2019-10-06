const { Game } = require("./classes");
import { BAD_SESSION } from "../client/src/redux/actions/types";
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
		socket.emit("serverRedirect", BAD_SESSION);
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3; //get the user's information

	//Socket Room for the Game
	socket.join("game" + gameId);

	//Socket Room for the Team
	socket.join("game" + gameId + "team" + gameTeam);

	//Socket Room for the Indiviual Controller
	socket.join("game" + gameId + "team" + gameTeam + "controller" + gameController);

	//Send the client intial game state data
	const thisGame = await new Game({ gameId }).init(); //get the Game
	//Assume the game exists, since we just came with a freshly authenticated session (might fail if game is deleted mid-login)
	const serverAction = await thisGame.initialStateAction(gameTeam, gameController);
	socket.emit("serverSendingAction", serverAction); //sends the data

	//TODO: reflect that the argument is a payload, change these to be objects that the server is receiving for continuity
	//Setup the socket functions to respond to client requests
	socket.on("clientSendingAction", ({ type, payload }) => {
		try {
			switch (type) {
				case "shopPurchaseRequest":
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
			await thisGame.setLoggedIn(gameTeam, gameController, 0);
		} catch (error) {
			//TODO: log errors to a file (for production/deployment reasons)
			console.error(error);
		}
	});
};

module.exports = socketSetup;
