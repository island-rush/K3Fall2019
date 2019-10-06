const { Game, Event } = require("../classes");
import { GAME_INACTIVE_TAG, BATTLE_FIGHT_RESULTS } from "../../client/src/redux/actions/types";
const sendUserFeedback = require("./sendUserFeedback");
const giveNextEvent = require("./giveNextEvent");

const confirmBattleSelection = async (socket, payload) => {
	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;
	const { friendlyPieces } = payload;

	const thisGame = await new Game({ gameId }).init();
	const { gameActive, gamePhase, game0Status, game1Status } = thisGame;

	if (!gameActive) {
		socket.emit("serverRedirect", GAME_INACTIVE_TAG);
		return;
	}

	const otherTeam = gameTeam == 0 ? 1 : 0;
	const thisTeamStatus = gameTeam == 0 ? game0Status : game1Status;
	const otherTeamStatus = otherTeam == 0 ? game0Status : game1Status;

	if (thisTeamStatus == 1 && otherTeamStatus == 0) {
		//TODO: trying to prevent race condition, but might mess things up? (repeat inputs...)
		sendUserFeedback(socket, "still waiting stupid...");
		return;
	}

	//confirm the selections
	const thisTeamsCurrentEvent = await Event.getNext(gameId, gameTeam);
	await thisTeamsCurrentEvent.bulkUpdateTargets(friendlyPieces);

	//are we waiting for the other client?
	if (otherTeamStatus == 0) {
		await thisGame.setStatus(gameTeam, 1);
		sendUserFeedback(socket, "confirmed, now waiting on other team...");
		return;
	}

	//if get here, other team was already waiting, need to set them to 0 and handle stuff
	await thisGame.setStatus(otherTeam, 0);

	//Do the fight!
	const fightResults = await thisTeamsCurrentEvent.fight();

	if (fightResults.atLeastOneBattle) {
		const serverAction = {
			type: BATTLE_FIGHT_RESULTS,
			payload: {
				masterRecord: fightResults.masterRecord
			}
		};

		socket.to("game" + gameId).emit("serverSendingAction", serverAction);
		socket.emit("serverSendingAction", serverAction);
		return;
	}

	await thisTeamsCurrentEvent.delete();
	await giveNextEvent(socket, { thisGame }); //not putting executingStep in options to let it know not to send pieceMove
};

module.exports = confirmBattleSelection;
