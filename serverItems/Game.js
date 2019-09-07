const pool = require("./database");

class Game {
	constructor(gameInfo) {
		const { gameId, gamePhase, gamePoints } = gameInfo;

		this.gameId = gameId;
		this.gamePhase = gamePhase;
		this.gamePoints = gamePoints;
	}

	static async getInfo(gameId) {
		const queryString = "SELECT * FROM games WHERE gameId = ?";
		const inserts = [gameId];
		const [results, fields] = await pool.query(queryString, inserts);
		return results[0];
	}

	static async getGameActive(gameId) {
		return await Game.getInfo(gameId).gameActive;
	}
}

module.exports = Game;
