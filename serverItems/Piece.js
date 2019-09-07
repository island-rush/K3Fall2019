const pool = require("./database");

class Piece {
	constructor(pieceId) {
		this.pieceId = pieceId;
	}

	static async getInfo(pieceId) {
		const queryString = "SELECT * FROM pieces WHERE pieceId = ?";
		const inserts = [pieceId];
		const [results, fields] = await pool.query(queryString, inserts);
		return results[0];
	}
}

module.exports = Piece;
