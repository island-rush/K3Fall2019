const { Game } = require("../classes");

const gameReset = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.status(403).redirect("/index.html?error=access");
		return;
	}

	const { gameId } = req.session.ir3;

	const thisGame = await new Game({ gameId }).init(); //If fails, will get caught by router
	await thisGame.reset();

	res.redirect("/teacher.html?gameReset=success");
};

module.exports = gameReset;
