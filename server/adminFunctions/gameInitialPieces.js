const pool = require("../database");
import { TYPE_MOVES, TYPE_FUEL, TANK_COMPANY_TYPE_ID, BLUE_TEAM_ID, RED_TEAM_ID, AIRBORN_ISR_TYPE_ID } from "../../client/src/constants/gameConstants";

// prettier-ignore
const piece = (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, options) => {
	const pieceOptions = options || {};
	//TODO: could have constants to indicated pieceVisible and pieceContainer (not in container == -1)
	const pieceContainerId = pieceOptions.pieceContainerId == undefined ? -1 : pieceOptions.pieceContainerId;
	const pieceVisible = pieceOptions.pieceVisible == undefined ? 0 : pieceOptions.pieceVisible;

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
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 0),
		piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 1),
		piece(gameId, RED_TEAM_ID, AIRBORN_ISR_TYPE_ID, 2)
	];

	const queryString = "INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?";
	const inserts = [firstPieces];
	await pool.query(queryString, inserts);
};

module.exports = gameInitialPieces;
