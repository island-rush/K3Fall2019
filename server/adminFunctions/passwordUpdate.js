const { Game } = require("../classes");
const pool = require("../database");
import { ACCESS_TAG } from "../pages/errorTypes";

const passwordUpdate = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	//TODO: delete all sockets assosiated with the game that was deleted?
	//send socket redirect? (if they were still on the game...prevent bad sessions from existing (extra protection from forgetting validation checks))

	const { gameId,gamePassword } = req.body;
	if (!gameId) {
		res.status(400).redirect("/courseDirector.html?passwordUpdate=failed"); //TODO: could have better errors here saying 'gameid missing', or 'game did not exist'
		return;
	}

	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		res.status(400).redirect("/courseDirector.html?passwordUpdate=failed");
		return;
	}

	const queryString = "UPDATE games SET game0Password = ?, game1Password = ? WHERE gameId = ?";
	const inserts = [gamePassword,gamePassword, gameId];
	await pool.query(queryString, inserts);

	res.redirect("/courseDirector.html?passwordUpdate=success");
};

module.exports = passwordUpdate;
