const { Game } = require("../classes");
const pool = require("../database");
const md5 = require("md5");
import { ACCESS_TAG } from "../pages/errorTypes";

const adminPwdUpdate = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	//TODO: delete all sockets assosiated with the game that was deleted?
	//send socket redirect? (if they were still on the game...prevent bad sessions from existing (extra protection from forgetting validation checks))
	
	const { gameId,adminUpdatePassword } = req.body;
	if (!gameId || !adminUpdatePassword) {
		res.status(400).redirect("/courseDirector.html?adminPwdUpdate=failed"); //TODO: could have better errors here saying 'gameid missing', or 'game did not exist'
		return;
	}

	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		res.status(400).redirect("/courseDirector.html?adminPwdUpdate=failed");
		return;
	}	

	const queryString = "UPDATE games SET gameAdminPassword = ? WHERE gameId = ?";
	const adminPasswordHashed = md5(adminUpdatePassword);
	const inserts = [adminPasswordHashed, gameId];
	await pool.query(queryString, inserts);

	res.redirect("/courseDirector.html?adminPwdUpdate=success");
};

module.exports = adminPwdUpdate;
