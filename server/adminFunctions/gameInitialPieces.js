const pool = require("../database");
import { TYPE_MOVES, TYPE_FUEL, TANK_COMPANY_TYPE_ID } from "../../client/src/gameData/GameConstants";

// prettier-ignore
const piece = (pieceGameId, pieceTeamName, pieceTypeId, piecePositionId, options) => {
	const pieceOptions = options || {};
	const pieceContainerId = pieceOptions.pieceContainerId == undefined ? -1 : pieceOptions.pieceContainerId;
	const pieceVisible = pieceOptions.pieceVisible == undefined ? 0 : pieceOptions.pieceVisible;

	const pieceTeamId = pieceTeamName == "Blue" ? 0 : 1;
	const pieceMoves = TYPE_MOVES[pieceTypeId];
	const pieceFuel = TYPE_FUEL[pieceTypeId];

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

//prettier-ignore
const gameInitialPieces = async gameId => {
	const firstPieces = [
		piece(gameId, "Blue", TANK_COMPANY_TYPE_ID, 0),
		piece(gameId, "Red", TANK_COMPANY_TYPE_ID, 2)
	];

	const queryString = "INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?";
	const inserts = [firstPieces];
	await pool.query(queryString, inserts);
};

module.exports = gameInitialPieces;
