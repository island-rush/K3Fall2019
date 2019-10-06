const { Game } = require("../classes");
import { ACCESS_TAG, BAD_REQUEST_TAG } from "../../client/src/redux/actions/types";
const md5 = require("md5");

const gameAdd = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(403, `/index.html?error=${ACCESS_TAG}`); //TODO: this is different from gameDelete.js status.redirect....
		return;
	}

	const { adminSection, adminInstructor, adminPassword } = req.body;
	if (!adminSection || !adminInstructor || !adminPassword) {
		//TODO: better errors on CD (could have same as index) (status?)
		res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
		return;
	}

	const adminPasswordHashed = md5(adminPassword);

	//TODO: validate inputs are within limits of database (4 characters for section....etc)

	const thisGame = await Game.add(adminSection, adminInstructor, adminPasswordHashed);

	if (!thisGame) {
		res.redirect("/courseDirector.html?gameAdd=failed"); //TODO: add status for failure?
	} else {
		res.redirect("/courseDirector.html?gameAdd=success");
	}
};

module.exports = gameAdd;
