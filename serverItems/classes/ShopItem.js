const pool = require("../database");

class ShopItem {
	constructor(shopItemId) {
		this.shopItemId = shopItemId;
	}

	async init() {
		const queryString = "SELECT * FROM shopItems WHERE shopItemId = ?";
		const inserts = [this.shopItemId];
		const [results] = await pool.query(queryString, inserts);

		if (results.length != 1) {
			return null;
		} else {
			Object.assign(this, results[0]);
			return this;
		}
	}

	async delete() {
		await ShopItem.delete(this.shopItemId);
	}

	static async insert(shopItemGameId, shopItemTeamId, shopItemTypeId) {
		const queryString = "INSERT INTO shopItems (shopItemGameId, shopItemTeamId, shopItemTypeId) values (?, ?, ?)";
		const inserts = [shopItemGameId, shopItemTeamId, shopItemTypeId];
		const [results] = await pool.query(queryString, inserts);
		const thisShopItem = new ShopItem(results.insertId);
		Object.assign(thisShopItem, {
			shopItemGameId,
			shopItemTeamId,
			shopItemTypeId
		});
		return thisShopItem;
	}

	static async delete(shopItemId) {
		const queryString = "DELETE FROM shopItems WHERE shopItemId = ?";
		const inserts = [shopItemId];
		await pool.query(queryString, inserts);
	}

	static async deleteAll(gameId, gameTeam) {
		const queryString = "DELETE FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
		const inserts = [gameId, gameTeam];
		await pool.query(queryString, inserts);
	}
}

module.exports = ShopItem;
