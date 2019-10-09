const { Game } = require("../classes");
import { BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, ALREADY_IN_TAG, LOGIN_TAG, GAME_INACTIVE_TAG } from "../pages/errorTypes";
const md5 = require("md5");

const gameLoginVerify = async (req, res) => {
	const { gameSection, gameInstructor, gameTeam, gameTeamPassword, gameController } = req.body;

	if (!gameSection || !gameInstructor || !gameTeam || !gameTeamPassword || !gameController) {
		res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
		return;
	}

	const inputPasswordHash = md5(gameTeamPassword);
	const commanderLoginField = "game" + gameTeam + "Controller" + gameController; //ex: 'game0Controller0'
	const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password

	const thisGame = await new Game({ gameSection, gameInstructor }).init();

	if (!thisGame) {
		res.redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
		return;
	}

	const { gameActive, gameId } = thisGame;

	if (!gameActive) {
		res.redirect(`/index.html?error=${GAME_INACTIVE_TAG}`);
		return;
	}

	if (thisGame[commanderLoginField] != 0) {
		res.redirect(`/index.html?error=${ALREADY_IN_TAG}`);
		return;
	}

	if (inputPasswordHash != thisGame[passwordHashToCheck]) {
		res.redirect(`/index.html?error=${LOGIN_TAG}`);
		return;
	}

	await thisGame.setLoggedIn(gameTeam, gameController, 1);

	req.session.ir3 = {
		gameId,
		gameTeam,
		gameController
	};

	res.redirect("/game.html");
};

module.exports = gameLoginVerify;
