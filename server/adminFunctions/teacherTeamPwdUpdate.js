const { Game } = require("../classes");
const pool = require("../database");
const md5 = require("md5");
import { ACCESS_TAG } from "../pages/errorTypes";

const teacherTeamPwdUpdate = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher) {
		res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	//TODO: delete all sockets assosiated with the game that was deleted?
	//send socket redirect? (if they were still on the game...prevent bad sessions from existing (extra protection from forgetting validation checks))

	const { team1Password,team2Password } = req.body;
	const { gameId } = req.session.ir3;
	var queryString = "";
	var inserts = "";	

	if (!gameId) {
		res.status(400).redirect("/teacher.html?teacherTeamPwdUpdate=failed"); //TODO: could have better errors here saying 'gameid missing', or 'game did not exist'
		return;
	}

	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		res.status(400).redirect("/teacher.html?teacherTeamPwdUpdate=failed");
		return;
	}	

	if(!team1Password && !team2Password){
		res.status(400).redirect("/teacher.html?teacherTeamPwdUpdate=failed");
		return;
	}
	else if( !team1Password && team2Password){			
		queryString = "UPDATE games SET game1Password = ? WHERE gameId = ?";
		const team2PasswordHashed = md5(team2Password);
		inserts = [team2PasswordHashed, gameId];
	}
	else if( team1Password && !team2Password){
		queryString = "UPDATE games SET game0Password = ? WHERE gameId = ?";
		const team1PasswordHashed = md5(team1Password);
		inserts = [team1PasswordHashed,gameId];
	}
	else{
		queryString = "UPDATE games SET game0Password = ?, game1Password = ? WHERE gameId = ?";
		const team1PasswordHashed = md5(team1Password);
		const team2PasswordHashed = md5(team2Password);
		inserts = [team1PasswordHashed,team2PasswordHashed, gameId];
	}

	await pool.query(queryString, inserts);

	res.redirect("/teacher.html?teacherTeamPwdUpdate=success");
};

module.exports = teacherTeamPwdUpdate;
