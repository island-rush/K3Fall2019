const { Game } = require("../classes");

const getGameActive = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.sendStatus(403);
		return;
	}

	const { gameId } = req.session.ir3;

	const thisGame = await new Game({ gameId }).init();
	const { gameActive } = thisGame;

	res.send(JSON.stringify(gameActive));
};

module.exports = getGameActive;
