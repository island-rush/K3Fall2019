const { Game } = require("../classes");
import { ACCESS_TAG } from "../pages/errorTypes";

const getNews = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.redirect(`/index.html?error=${ACCESS_TAG}`);
		return;
	}

	const { gameId } = req.session.ir3;

	try {
		const results = await Game.getAllNews(gameId);
		res.send(results);
	} catch (error) {
		console.error(error);
		//RODO: this wouldn't happen, need database to get to teacher page anyways
		res.status(500).send([
			{
				newsId: 69,
				newsTitle: "DATABASE FAILED"
			}
		]);
	}
};

module.exports = getNews;
