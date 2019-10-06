const sendUserFeedback = require("./sendUserFeedback");
const { Game } = require("../classes");
const { GAME_INACTIVE_TAG, MAIN_BUTTON_CLICK, PURCHASE_PHASE, COMBAT_PHASE, NEWS_PHASE, SLICE_CHANGE } = require("../constants");
const executeStep = require("./executeStep"); //big function

const mainButtonClick = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	const thisGame = await new Game({ gameId }).init(); //TODO: if game is deleted mid-game, this would error (return null)
	const { gameActive, gamePhase, gameRound, gameSlice, game0Status, game1Status } = thisGame;

	if (!gameActive) {
		socket.emit("serverRedirect", GAME_INACTIVE_TAG);
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
		socket.emit("serverSendingAction", serverAction);
		return;
	}

	await thisGame.setStatus(otherTeam, 0); //Could skip awaiting since not used later in this function...(but can't assume it's gunna happen before we need to use it again...)
	await thisGame.setStatus(gameTeam, 0); //TODO: make this a single call, only using 2 to prevent race condition stuff, should set both to 0 to be safe...

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
				serverAction = {
					type: SLICE_CHANGE,
					payload: {}
				};
			} else {
				await executeStep(socket, thisGame);
				return; //executeStep will handle sending socket stuff, most likely separate for each client
			}
			break;

		//Place Troops -> News
		case 3:
			await thisGame.setPhase(0);
			serverAction = {
				type: NEWS_PHASE,
				payload: {}
			};
			break;

		default:
			sendUserFeedback(socket, "Backend Failure, unkown gamePhase...");
			return;
	}

	//Send to all clients
	socket.to("game" + gameId).emit("serverSendingAction", serverAction);
	socket.emit("serverSendingAction", serverAction);
};

module.exports = mainButtonClick;
