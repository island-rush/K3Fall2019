const { Game } = require("../classes");
import { BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, ALREADY_IN_TAG, LOGIN_TAG, GAME_INACTIVE_TAG } from "../pages/errorTypes";
const md5 = require("md5");

const gameLoginVerify = async (req, res) => {
    //TODO: probably check these before grabbing them for safety
    const { gameSection, gameInstructor, gameTeam, gameTeamPassword, gameControllers } = req.body;

    if (!gameSection || !gameInstructor || !gameTeam || !gameTeamPassword || !gameControllers) {
        res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

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

    const inputPasswordHash = md5(gameTeamPassword);
    const passwordHashToCheck = "game" + gameTeam + "Password"; //ex: 'game0Password
    if (inputPasswordHash != thisGame[passwordHashToCheck]) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }

    for (let x = 0; x < gameControllers.length; x++) {
        let gameController = parseInt(gameControllers[x]);
        let commanderLoginField = "game" + gameTeam + "Controller" + gameController;
        if (thisGame[commanderLoginField] != 0) {
            res.redirect(`/index.html?error=${ALREADY_IN_TAG}`);
            return;
        }
    }

    let gameControllersInt = [];
    for (let x = 0; x < gameControllers.length; x++) {
        await thisGame.setLoggedIn(gameTeam, gameControllers[x], 1);
        gameControllersInt.push(parseInt(gameControllers[x]));
    }

    req.session.ir3 = {
        gameId,
        gameTeam,
        gameControllers: gameControllersInt
    };

    res.redirect("/game.html");
};

module.exports = gameLoginVerify;
