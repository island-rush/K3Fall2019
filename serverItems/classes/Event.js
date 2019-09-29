const pool = require("../database");

class Event {
	//TODO: we have a class for event, but multiple tables for keeping track of events, event items, and that one for temp stuff (efficient)
	constructor(eventId) {
		this.eventId = eventId;
	}

	async init() {
		const queryString = "SELECT * FROM eventQueue WHERE eventId = ?";
		const inserts = [this.eventId];
		const [results] = await pool.query(queryString, inserts);

		if (results.length != 1) {
			return null;
		} else {
			Object.assign(this, results[0]);
			return this;
		}
	}

	async delete() {
		const queryString = "DELETE FROM eventQueue WHERE eventId = ?";
		const inserts = [this.eventId];
		await pool.query(queryString, inserts);
	}

	async getItems() {
		const queryString = "SELECT * FROM eventItems NATURAL JOIN pieces WHERE eventId = ? AND eventPieceId = pieceId";
		const inserts = [this.eventId];
		const [eventItems] = await pool.query(queryString, inserts);

		if (eventItems.length == 0) {
			return null;
		} else {
			return eventItems;
		}
	}

	async getTeamItems(gameTeam) {
		const queryString =
			"SELECT * FROM (SELECT * FROM eventItems NATUAL JOIN pieces WHERE eventPieceId = pieceId AND eventId = ? AND pieceTeamId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceGameId as tpieceGameId, pieceTeamId as tpieceTeamId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId, pieceContainerId as tpieceContainerId, pieceVisible as tpieceVisible, pieceMoves as tpieceMoves, pieceFuel as tpieceFuel FROM pieces) b ON a.eventItemTarget = b.tpieceId";
		const inserts = [this.eventId, gameTeam];
		const [eventTeamItems] = await pool.query(queryString, inserts);
		return eventTeamItems; //TODO: do we need to return null explicitly? (this is an empty array ^^^ see getItems for difference (not sure why needed))
	}

	static async getNext(gameId, gameTeam) {
		const queryString = "SELECT * FROM eventQueue WHERE eventGameId = ? AND (eventTeamId = ? OR eventTeamId = 2) ORDER BY eventId ASC LIMIT 1";
		const inserts = [gameId, gameTeam];
		const [events] = await pool.query(queryString, inserts);

		if (events.length != 1) {
			return null;
		} else {
			const thisEvent = await new Event(events[0]["eventId"]).init();
			return thisEvent;
		}
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
		const conn = await pool.getConnection();

		let queryString = "INSERT INTO eventItemsTemp (eventPieceId, eventItemGameId, eventPosA, eventPosB) VALUES ?";
		let inserts = [allInserts];
		await conn.query(queryString, inserts);

		queryString =
			"INSERT INTO eventItems (eventId, eventPieceId) SELECT eventId, eventPieceId FROM eventItemsTemp NATURAL JOIN eventQueue WHERE eventItemsTemp.eventPosA = eventQueue.eventPosA AND eventItemsTemp.eventPosB = eventQueue.eventPosB AND eventItemsTemp.eventItemGameId = eventQueue.eventGameId";
		await conn.query(queryString);

		queryString = "DELETE FROM eventItemsTemp WHERE eventItemGameId = ?";
		inserts = [gameId];
		await conn.query(queryString, inserts);

		conn.release();
	}

	async bulkUpdateTargets(piecesWithTargets) {
		//TODO: make sure that these piece->targets make sense (prevent bad targetting? (if possible...))
		let allInserts = [];
		for (let x = 0; x < piecesWithTargets.length; x++) {
			let { piece, targetPiece } = piecesWithTargets[x];
			let newInsert = [this.eventId, piece.pieceId, targetPiece === null ? -1 : targetPiece.pieceId, this.eventGameId];
			allInserts.push(newInsert);
		}

		let queryString = "INSERT INTO eventItemsTargetsTemp (eventId, eventPieceId, eventItemTarget, eventItemGameId) VALUES ?";
		let inserts = [allInserts];
		await pool.query(queryString, inserts);

		queryString =
			"UPDATE eventItems, eventItemsTargetsTemp SET eventItems.eventItemTarget = eventItemsTargetsTemp.eventItemTarget WHERE eventItems.eventId = eventItemsTargetsTemp.eventId AND eventItems.eventPieceId = eventItemsTargetsTemp.eventPieceId";
		await pool.query(queryString);

		queryString = "DELETE FROM eventItemsTargetsTemp WHERE eventItemGameId = ?";
		inserts = [this.eventGameId];
		await pool.query(queryString, inserts);
	}

	async fight() {
		//get the eventItems from the database
	}
}

module.exports = Event;
