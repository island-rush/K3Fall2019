const { Game } = require("../classes");
const md5 = require("md5");
import { ACCESS_TAG, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST } from "../pages/errorTypes";

const setAdminPassword = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	if (req.body.gameId == null || req.body.adminPassword == null) {
		res.status(403).redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
		return;
	}

	const { gameId, adminPassword } = req.body;
	const thisGame = await new Game({ gameId }).init();
	if (!thisGame) {
		res.status(400).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
		return;
	}

	const adminPasswordHashed = md5(adminPassword);
	await thisGame.setAdminPassword(adminPasswordHashed);

	res.redirect("/courseDirector.html?setAdminPassword=success");
};

module.exports = setAdminPassword;
