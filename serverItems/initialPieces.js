const { typeNameIds, typeMoves, typeFuel } = require("./constants");

// prettier-ignore
const piece = (pieceGameId, pieceTeamName, pieceTypeName, piecePositionId, options) => {
	const pieceOptions = options || {};
	const pieceContainerId = pieceOptions.pieceContainerId === undefined ? -1 : pieceOptions.pieceContainerId;
	const pieceVisible = pieceOptions.pieceVisible === undefined ? 0 : pieceOptions.pieceVisible;

	const pieceTeamId = pieceTeamName === "Blue" ? 0 : 1;
	const pieceTypeId = typeNameIds[pieceTypeName];
	const pieceMoves = typeMoves[pieceTypeId];
	const pieceFuel = typeFuel[pieceTypeId];
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
		// piece(gameId, "Blue", "Tank", 0),
		// piece(gameId, "Blue", "Tank", 1, {pieceVisible: 1}),
		// piece(gameId, "Red", "Tank", 118),
		// piece(gameId, "Red", "Tank", 119, {pieceVisible: 1}),
		piece(gameId, "Blue", "Tank", 0),
		piece(gameId, "Red", "Tank", 7)
		// piece(gameId, "Blue", "Tank", 3, {pieceVisible: 1}),
		// piece(gameId, "Red", "Tank", 5, {pieceVisible: 1}),
		// piece(gameId, "Blue", "Tank", 7, {pieceVisible: 1}),
		// piece(gameId, "Red", "Tank", 7, {pieceVisible: 1})
		// piece(gameId, "Red", "Sub", 2),
		// piece(gameId, "Red", "Plane", 2),
		// piece(gameId, "Red", "Transport", 2),
		// piece(gameId, "Blue", "Tank", 3)
	];

	queryString = "INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?";
	inserts = [firstPieces];
	await conn.query(queryString, inserts);
};
