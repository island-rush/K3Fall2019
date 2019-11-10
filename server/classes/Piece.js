const pool = require("../database");
import { VISIBILITY_MATRIX, TYPE_MOVES, REMOTE_SENSING_RANGE, TYPE_NAME_IDS } from "../../client/src/gameData/gameConstants";
import { distanceMatrix } from "../../client/src/gameData/distanceMatrix";

class Piece {
	constructor(pieceId, options) {
		this.pieceId = pieceId;
		//TODO: did these options come from the client? (if so, more secure to not accept them...but unlikely would actually get hacked...)
		if (options) {
			Object.assign(this, options);
		}
	}

	async init() {
		const queryString = "SELECT * FROM pieces WHERE pieceId = ?";
		const inserts = [this.pieceId];
		const [results] = await pool.query(queryString, inserts);

		if (results.length != 1) {
			return null;
		} else {
			Object.assign(this, results[0]);
			return this;
		}
	}

	async delete() {
		const queryString = "DELETE FROM pieces WHERE pieceId = ?";
		const inserts = [this.pieceId];
		await pool.query(queryString, inserts);
	}

	//TODO: referencing another table, could potentially move this function (maybe)
	async deletePlans() {
		const queryString = "DELETE FROM plans WHERE planPieceId = ?";
		const inserts = [this.pieceId];
		await pool.query(queryString, inserts);
	}

	// prettier-ignore
	static async updateVisibilities(gameId) {
		const conn = await pool.getConnection();

		//set all to invisible
		let queryString = "UPDATE pieces SET pieceVisible = 0 WHERE pieceGameId = ?";
		let inserts = [gameId];
		await conn.query(queryString, inserts);

		//posTypes[teamToUpdate][typeToUpdate] = [...positionsThatThoseTypesAreVisibleOn]
		let posTypesVisible = [
			[[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
			[[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]]
		];

		//only need to check distinct pieces, (100 red tanks in same position == 1 red tank in same position)
		queryString = "SELECT DISTINCT pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId FROM pieces WHERE pieceGameId = ?";
		inserts = [gameId];
		const [pieces] = await conn.query(queryString, inserts);

		let otherTeam;
		for (let x = 0; x < pieces.length; x++) {
			let { pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId } = pieces[x]; //TODO: pieces inside containers can't see rule?

			//TODO: constant instead of 20 (number of pieces, also change it above when constructing the array(s)?)
			for (let type = 0; type < 20; type++) { //check each type
				if (VISIBILITY_MATRIX[pieceTypeId][type] !== -1) { //could it ever see this type?
					for (let position = 0; position < distanceMatrix[piecePositionId].length; position++) { //for all positions
						if (distanceMatrix[piecePositionId][position] <= VISIBILITY_MATRIX[pieceTypeId][type]) { //is this position in range for that type?
							otherTeam = parseInt(pieceTeamId) == 0 ? 1 : 0;

							if (!posTypesVisible[otherTeam][type].includes(position)) { //add this position if not already added by another piece somewhere else
								posTypesVisible[otherTeam][type].push(position);
							}
						}
					}
				}
			}
		}

		//also check remote sensing effects
		queryString = "SELECT * FROM remoteSensing WHERE gameId = ?";
		inserts = [gameId];
		const [results] = await conn.query(queryString, inserts);

		for (let x = 0; x < results.length; x++) {
			let remoteSenseCenter = results[x].positionId;
			for (let currentPos = 0; currentPos < distanceMatrix[remoteSenseCenter].length; currentPos++) {
				if (distanceMatrix[remoteSenseCenter][currentPos] <= REMOTE_SENSING_RANGE) {
					//put these positions into the posTypesVisible (based on team)
					let { teamId } = results[x];
					let otherTeam = teamId === 0 ? 1 : 0;
					for (let pieceType = 0; pieceType < posTypesVisible[otherTeam].length; pieceType++) {
						//does not see subs or sof teams
						if (!posTypesVisible[otherTeam][pieceType].includes(currentPos) && piceType !== TYPE_NAME_IDS["SOF Team"] && pieceType !== TYPE_NAME_IDS["Submarine"]) { //add this position if not already added by another piece somewhere else
							posTypesVisible[otherTeam][pieceType].push(currentPos);
						}
					}
				}
			}
		}

		//Bulk update for all visibilities
		queryString = "UPDATE pieces SET pieceVisible = 1 WHERE pieceGameId = ? AND ((pieceTeamId = 0 AND pieceTypeId = 0 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 2 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 3 AND piecePositionId IN (?)) OR (pieceTeamId = 4 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 5 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 6 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 7 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 8 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 9 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 10 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 11 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 12 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 13 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 14 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 15 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 16 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 17 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 18 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 19 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 0 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 2 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 3 AND piecePositionId IN (?)) OR (pieceTeamId = 4 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 5 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 6 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 7 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 8 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 9 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 10 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 11 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 12 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 13 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 14 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 15 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 16 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 17 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 18 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 19 AND piecePositionId IN (?)))";
		inserts = [gameId, posTypesVisible[0][0], posTypesVisible[0][1], posTypesVisible[0][2], posTypesVisible[0][3], posTypesVisible[0][4], posTypesVisible[0][5], posTypesVisible[0][6], posTypesVisible[0][7], posTypesVisible[0][8], posTypesVisible[0][9], posTypesVisible[0][10], posTypesVisible[0][11], posTypesVisible[0][12], posTypesVisible[0][13], posTypesVisible[0][14], posTypesVisible[0][15], posTypesVisible[0][16], posTypesVisible[0][17], posTypesVisible[0][18], posTypesVisible[0][19], posTypesVisible[1][0], posTypesVisible[1][1], posTypesVisible[1][2], posTypesVisible[1][3], posTypesVisible[1][4], posTypesVisible[1][5], posTypesVisible[1][6], posTypesVisible[1][7], posTypesVisible[1][8], posTypesVisible[1][9], posTypesVisible[1][10], posTypesVisible[1][11], posTypesVisible[1][12], posTypesVisible[1][13], posTypesVisible[1][14], posTypesVisible[1][15], posTypesVisible[1][16], posTypesVisible[1][17], posTypesVisible[1][18], posTypesVisible[1][19]];
		await conn.query(queryString, inserts);

		conn.release();
	}

	static async move(gameId, movementOrder) {
		//movement based on plans (for this order/step)
		const conn = await pool.getConnection();

		const inserts = [gameId, movementOrder];
		const movePiecesQuery =
			"UPDATE pieces, plans SET pieces.piecePositionId = plans.planPositionId, pieces.pieceMoves = pieces.pieceMoves - 1 WHERE pieces.pieceId = plans.planPieceId AND planGameId = ? AND plans.planMovementOrder = ? AND plans.planSpecialFlag = 0";
		await conn.query(movePiecesQuery, inserts);

		//TODO: referencing another table here...(could change to put into the plans class)
		const deletePlansQuery = "DELETE FROM plans WHERE planGameId = ? AND planMovementOrder = ? AND planSpecialFlag = 0";
		await conn.query(deletePlansQuery, inserts);

		//handle if the pieces moved into a bio / nuclear place
		let queryString = "SELECT * FROM biologicalWeapons WHERE gameId = ? AND activated = 1";
		let moreInserts = [gameId];
		const [results] = await conn.query(queryString, moreInserts);

		let listOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			//delete the pieces in these positions
			let thisBioWeapon = results[x];
			let { positionId } = thisBioWeapon;
			listOfPositions.push(positionId);
		}

		//TODO: only do this for ground pieces...
		if (listOfPositions > 0) {
			queryString = "DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)";
			moreInserts = [gameId, listOfPositions];
			await conn.query(queryString, moreInserts);
		}

		conn.release();
	}

	static async getVisiblePieces(gameId, gameTeam) {
		const queryString = "SELECT * FROM pieces WHERE pieceGameId = ? AND (pieceTeamId = ? OR pieceVisible = 1) ORDER BY pieceContainerId, pieceTeamId ASC";
		const inserts = [gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);

		//format for the client state
		let allPieces = {};
		for (let x = 0; x < results.length; x++) {
			let currentPiece = results[x];
			currentPiece.pieceContents = { pieces: [] };
			if (!allPieces[currentPiece.piecePositionId]) {
				allPieces[currentPiece.piecePositionId] = [];
			}
			if (currentPiece.pieceContainerId == -1) {
				allPieces[currentPiece.piecePositionId].push(currentPiece);
			} else {
				let indexOfParent = allPieces[currentPiece.piecePositionId].findIndex(piece => {
					return piece.pieceId == currentPiece.pieceContainerId;
				});
				allPieces[currentPiece.piecePositionId][indexOfParent].pieceContents.push(currentPiece);
			}
		}

		return allPieces;
	}

	static async getPositionRefuels(gameId, gameTeam) {
		const queryString =
			"SELECT tnkr.pieceId as tnkrPieceId, tnkr.pieceTypeId as tnkrPieceTypeId, tnkr.piecePositionId as tnkrPiecePositionId, tnkr.pieceMoves as tnkrPieceMoves, tnkr.pieceFuel as tnkrPieceFuel, arcft.pieceId as arcftPieceId, arcft.pieceTypeId as arcftPieceTypeId, arcft.piecePositionId as arcftPiecePositionId, arcft.pieceMoves as arcftPieceMoves, arcft.pieceFuel as arcftPieceFuel FROM (SELECT * FROM pieces WHERE pieceTypeId = 3 AND pieceGameId = ? AND pieceTeamId = ?) as tnkr JOIN (SELECT * FROM pieces WHERE pieceTypeId in (0, 1, 2, 4, 5, 17, 18) AND pieceGameId = ? AND pieceTeamId = ?) as arcft ON tnkr.piecePositionId = arcft.piecePositionId WHERE arcft.pieceContainerId = -1";
		const inserts = [gameId, gameTeam, gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);

		//TODO: should deal with results here and return with other things, or do entire function in this method... calling the other bulk inserts and stuff available?
		return results;
	}

	static async insert(pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) {
		let queryString =
			"INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		let inserts = [pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel];
		const [results] = await pool.query(queryString, inserts);
		const thisPiece = new Piece(results.insertId);
		Object.assign(thisPiece, {
			pieceGameId,
			pieceTeamId,
			pieceTypeId,
			piecePositionId,
			pieceContainerId,
			pieceVisible,
			pieceMoves,
			pieceFuel
		});
		return thisPiece;
	}

	static async resetMoves(gameId) {
		const testquery =
			"UPDATE pieces SET pieceMoves = CASE WHEN pieceTypeId = 0 THEN ? WHEN pieceTypeId = 1 THEN ? WHEN pieceTypeId = 2 THEN ? WHEN pieceTypeId = 3 THEN ? WHEN pieceTypeId = 4 THEN ? WHEN pieceTypeId = 5 THEN ? WHEN pieceTypeId = 6 THEN ? WHEN pieceTypeId = 7 THEN ? WHEN pieceTypeId = 8 THEN ? WHEN pieceTypeId = 9 THEN ? WHEN pieceTypeId = 10 THEN ? WHEN pieceTypeId = 11 THEN ? WHEN pieceTypeId = 12 THEN ? WHEN pieceTypeId = 13 THEN ? WHEN pieceTypeId = 14 THEN ? WHEN pieceTypeId = 15 THEN ? WHEN pieceTypeId = 16 THEN ? WHEN pieceTypeId = 17 THEN ? WHEN pieceTypeId = 18 THEN ? WHEN pieceTypeId = 19 THEN ? END WHERE pieceGameId = ?";
		const inserts = [
			TYPE_MOVES[0],
			TYPE_MOVES[1],
			TYPE_MOVES[2],
			TYPE_MOVES[3],
			TYPE_MOVES[4],
			TYPE_MOVES[5],
			TYPE_MOVES[6],
			TYPE_MOVES[7],
			TYPE_MOVES[8],
			TYPE_MOVES[9],
			TYPE_MOVES[10],
			TYPE_MOVES[11],
			TYPE_MOVES[12],
			TYPE_MOVES[13],
			TYPE_MOVES[14],
			TYPE_MOVES[15],
			TYPE_MOVES[16],
			TYPE_MOVES[17],
			TYPE_MOVES[18],
			TYPE_MOVES[19],
			gameId
		];
		await pool.query(testquery, inserts);
	}
}

module.exports = Piece;
