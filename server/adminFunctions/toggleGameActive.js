const { Game } = require("../classes");

const toggleGameActive = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.sendStatus(403); //TODO: redirect here?
		return;
	}

	const { gameId } = req.session.ir3;

	const thisGame = await new Game({ gameId }).init();
	const { gameActive } = thisGame;
	const newValue = (gameActive + 1) % 2;
	await thisGame.setGameActive(newValue);

	res.sendStatus(200);
};

module.exports = toggleGameActive;
