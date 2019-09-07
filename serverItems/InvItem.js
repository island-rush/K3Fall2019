const pool = require("./database");

class InvItem {
	constructor(invItemId) {
		this.invItemId = invItemId;
	}

	async init() {
		const queryString = "SELECT * FROM invItems WHERE invItemId = ?";
		const inserts = [this.invItemId];
		const [results] = await pool.query(queryString, inserts);
		Object.assign(this, results[0]);
	}
}

module.exports = InvItem;
