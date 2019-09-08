const pool = require("../database");

class InvItem {
	constructor(invItemId) {
		this.invItemId = invItemId;
	}

	async init() {
		const queryString = "SELECT * FROM invItems WHERE invItemId = ?";
		const inserts = [this.invItemId];
		const [results] = await pool.query(queryString, inserts);

		if (results.length != 1) {
			return null;
		} else {
			Object.assign(this, results[0]);
			return this;
		}
	}

	static async insertFromShop(gameId, gameTeam) {
		const queryString = "INSERT INTO invItems (invItemId, invItemGameId, invItemTeamId, invItemTypeId) SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
		const inserts = [gameId, gameTeam];
		await pool.query(queryString, inserts);
	}

	static async all(gameId, gameTeam) {
		const queryString = "SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
		const inserts = [gameId, gameTeam];
		const [invItems] = await pool.query(queryString, inserts);
		return invItems;
	}
}

module.exports = InvItem;
