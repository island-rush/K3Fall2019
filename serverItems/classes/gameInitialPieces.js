const CONSTANTS = require("../constants");

// prettier-ignore
const piece = (pieceGameId, pieceTeamName, pieceTypeName, piecePositionId, options) => {
	const pieceOptions = options || {};
	const pieceContainerId = pieceOptions.pieceContainerId === undefined ? -1 : pieceOptions.pieceContainerId;
	const pieceVisible = pieceOptions.pieceVisible === undefined ? 0 : pieceOptions.pieceVisible;

	const pieceTeamId = pieceTeamName === "Blue" ? 0 : 1;
	const pieceTypeId = CONSTANTS.TYPE_NAME_IDS[pieceTypeName];
	const pieceMoves = CONSTANTS.TYPE_MOVES[pieceTypeId];
	const pieceFuel = CONSTANTS.TYPE_FUEL[pieceTypeId];

	return [
		pieceGameId,
		pieceTeamId,
		pieceTypeId,
		piecePositionId,
		pieceContainerId,
		pieceVisible,
		pieceMoves,
		pieceFuel
	];
};

// prettier-ignore
module.exports = async (conn, gameId) => {
	const firstPieces = [
		// piece(gameId, "Blue", "Tank", 0, {pieceVisible: 1, pieceContainerId: 23}),
		piece(gameId, "Blue", "Tank", 0),
		piece(gameId, "Red", "Tank", 1),
		// piece(gameId, "Blue", "Tank", 2),
		piece(gameId, "Blue", "Tank", 3),
		piece(gameId, "Blue", "Tank", 3),
		piece(gameId, "Blue", "Tank", 3),
		piece(gameId, "Blue", "Tank", 3),
		// piece(gameId, "Blue", "Tank", 4),
		piece(gameId, "Red", "Artillery", 5),
		piece(gameId, "Red", "Artillery", 5),
		piece(gameId, "Red", "Artillery", 5),
		piece(gameId, "Red", "Artillery", 5)
		// piece(gameId, "Blue", "Tank", 6),
		// piece(gameId, "Red", "Tank", 7)
	];

	const queryString = "INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?";
	const inserts = [firstPieces];
	await conn.query(queryString, inserts);
};
