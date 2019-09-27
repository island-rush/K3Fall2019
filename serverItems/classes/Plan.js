const pool = require("../database");

class Plan {
	constructor(planPieceId, planMovementOrder) {
		this.planPieceId = planPieceId;
		this.planMovementOrder = planMovementOrder;
	}

	async init() {
		const queryString = "SELECT * FROM plans WHERE planPieceId = ? AND planMovementOrder = ?";
		const inserts = [this.planPieceId, this.planMovementOrder];
		const [results] = await pool.query(queryString, inserts);

		if (results.length != 1) {
			return null;
		} else {
			Object.assign(this, results[0]);
			return this;
		}
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

	// this may be not used since this already taken care of by Pieces.move or something...
	// async delete() {
	// 	const queryString = "DELETE FROM plans WHERE planPieceId = ?";
	// 	const inserts = [this.planPieceId];
	// 	await pool.query(queryString, inserts);
	// }

	static async getCurrentMovementOrder(gameId, gameTeam) {
		const queryString = "SELECT planMovementOrder FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planMovementOrder ASC LIMIT 1";
		const inserts = [gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);
		return results.length !== 0 ? results[0]["planMovementOrder"] : null;
	}

	static async getCollisionBattles(gameId, movementOrder) {
		const queryString =
			"SELECT * FROM (SELECT pieceId as pieceId0, pieceTypeId as pieceTypeId0, pieceContainerId as pieceContainerId0, piecePositionId as piecePositionId0, planPositionId as planPositionId0 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 0 AND pieceGameId = ? AND planMovementOrder = ?) as a JOIN (SELECT pieceId as pieceId1, pieceTypeId as pieceTypeId1, pieceContainerId as pieceContainerId1, piecePositionId as piecePositionId1, planPositionId as planPositionId1 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 1 AND pieceGameId = ? AND planMovementOrder = ?) as b ON piecePositionId0 = planPositionId1 AND planPositionId0 = piecePositionId1";
		const inserts = [gameId, movementOrder, gameId, movementOrder];
		const [results] = await pool.query(queryString, inserts);
		return results;
	}

	static async getPositionBattles(gameId) {
		const queryString =
			"SELECT * FROM (SELECT pieceId as pieceId0, piecePositionId as piecePositionId0, pieceTypeId as pieceTypeId0, pieceContainerId as pieceContainerId0 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 0) as a JOIN (SELECT pieceId as pieceId1, piecePositionId as piecePositionId1, pieceTypeId as pieceTypeId1, pieceContainerId as pieceContainerId1 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 1) as b ON piecePositionId0 = piecePositionId1";
		const inserts = [gameId, gameId];
		const [results] = await pool.query(queryString, inserts);
		return results;
	}

	static async getConfirmedPlans(gameId, gameTeam) {
		const queryString = "SELECT * FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planPieceId, planMovementOrder ASC";
		const inserts = [gameId, gameTeam];
		const [resultPlans] = await pool.query(queryString, inserts);

		//formatting for the client, needs it in this object kinda way
		let confirmedPlans = {};
		for (let x = 0; x < resultPlans.length; x++) {
			let { planPieceId, planPositionId, planSpecialFlag } = resultPlans[x];
			let type = planSpecialFlag === 0 ? "move" : planSpecialFlag === 1 ? "container" : "NULL_SPECIAL";

			if (!(planPieceId in confirmedPlans)) {
				confirmedPlans[planPieceId] = [];
			}

			confirmedPlans[planPieceId].push({
				type,
				positionId: planPositionId
			});
		}

		return confirmedPlans;
	}
}

module.exports = Plan;
