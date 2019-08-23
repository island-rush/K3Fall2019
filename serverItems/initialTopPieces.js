const { typeNameIds, typeMoves, typeFuel } = require("./constants");

const piece = (
	pieceGameId,
	pieceTeamName,
	pieceTypeName,
	piecePositionId,
	pieceContainerId = -1,
	pieceVisible = 1
) => {
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

exports.generateDefaultPieces = gameId => {
	return [
		piece(gameId, "Blue", "Tank", 0),
		piece(gameId, "Blue", "Tank", 1),
		piece(gameId, "Red", "Tank", 2),
		piece(gameId, "Red", "Tank", 3)
		// piece(gameId, "Blue", "Tank", 1),
		// piece(gameId, "Red", "Radar", 2),
		// piece(gameId, "Red", "Sub", 2),
		// piece(gameId, "Red", "Plane", 2),
		// piece(gameId, "Red", "Transport", 2),
		// piece(gameId, "Blue", "Tank", 3)
	];
};
