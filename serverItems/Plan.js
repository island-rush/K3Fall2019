const pool = require("./database");

class Plan {
	constructor(planPieceId, planMovementOrder) {
		this.planPieceId = planPieceId;
		this.planMovementOrder = planMovementOrder;
	}

	async init() {
		const queryString = "SELECT * FROM plans WHERE planPieceId = ? AND planMovementOrder = ?";
		const inserts = [this.planPieceId, this.planMovementOrder];
		const [results] = await pool.query(queryString, inserts);
		Object.assign(this, results[0]);
	}

	static async insert(plansToInsert) {
		const queryString = "INSERT INTO plans (planGameId, planTeamId, planPieceId, planMovementOrder, planPositionId, planSpecialFlag) VALUES ?";
		const inserts = [plansToInsert];
		await pool.query(queryString, inserts);
	}

	static async delete(pieceId) {
		const queryString = "DELETE FROM plans WHERE planPieceId = ?";
		const inserts = [pieceId];
		await pool.query(queryString, inserts);
	}

	static async getCurrentMovementOrder(gameId, gameTeam) {
		const queryString = "SELECT planMovementOrder FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planMovementOrder ASC LIMIT 1";
		const inserts = [gameId, gameTeam];
		const [results] = await conn.query(queryString, inserts);
		return results.length !== 0 ? results[0]["planMovementOrder"] : null;
	}
}

module.exports = Plan;
