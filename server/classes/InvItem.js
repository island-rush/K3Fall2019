const pool = require("../database");
const CONSTANTS = require("../constants");
const Piece = require("./Piece");

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

	async delete() {
		const queryString = "DELETE FROM invItems WHERE invItemId = ?";
		const inserts = [this.invItemId];
		await pool.query(queryString, inserts);
	}

	async placeOnBoard(selectedPosition) {
		const newPiece = await Piece.insert(
			this.invItemGameId,
			this.invItemTeamId,
			this.invItemTypeId,
			selectedPosition,
			-1,
			0,
			CONSTANTS.TYPE_MOVES[this.invItemTypeId],
			CONSTANTS.TYPE_FUEL[this.invItemTypeId]
		);

		await this.delete();

		return newPiece;
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
