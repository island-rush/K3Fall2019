const pool = require("../database");

class Event {
	constructor(eventId) {
		this.eventId = eventId;
	}

	async init() {
		const queryString = "SELECT * FROM eventQueue WHERE eventId = ?";
		const inserts = [this.eventId];
		const [results] = await pool.query(queryString, inserts);
		Object.assign(this, results[0]);
	}

	static async all(gameId) {
		const queryString = "SELECT * FROM eventQueue WHERE eventGameId = ? ORDER BY eventId ASC";
		const inserts = [gameId];
		const [events] = await pool.query(queryString, inserts);
		return events;
	}

	static async bulkInsertEvents(allInserts) {
		const queryString = "INSERT INTO eventQueue (eventGameId, eventTeamId, eventTypeId, eventPosA, eventPosB) VALUES ?";
		const inserts = [allInserts];
		await pool.query(queryString, inserts);
	}

	static async bulkInsertItems(gameId, allInserts) {
		const conn = pool.getConnection();

		let queryString = "INSERT INTO eventItemsTemp (eventPieceId, eventItemGameId, eventPosA, eventPosB) VALUES ?";
		let inserts = [allInserts];
		await conn.query(queryString, inserts);

		queryString =
			"INSERT INTO eventItems SELECT eventId, eventPieceId FROM eventItemsTemp NATURAL JOIN eventQueue WHERE eventItemsTemp.eventPosA = eventQueue.eventPosA AND eventItemsTemp.eventPosB = eventQueue.eventPosB AND eventItemsTemp.eventItemGameId = eventQueue.eventGameId";
		await conn.query(queryString);

		queryString = "DELETE FROM eventItemsTemp WHERE eventItemGameId = ?";
		inserts = [gameId];
		await conn.query(queryString, inserts);

		conn.release();
	}
}

module.exports = Event;
