const { Game } = require("../classes");
import { ACCESS_TAG } from "../pages/errorTypes";

const getGames = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	try {
		const results = await Game.getGames();
		res.send(results);
	} catch (error) {
		console.error(error);
		//Manually send 1 game that makes it obvious what the error is...TODO: change this into a redirect or custom 500 page (but need CourseDirector page to enter tables....)
		res.status(500).send([
			{
				gameId: 69,
				gameSection: "DATABASE",
				gameInstructor: "FAILED",
				gameActive: 0
			}
		]);
	}
};

module.exports = getGames;
