const pool = require("./database");

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
}

module.exports = Event;
