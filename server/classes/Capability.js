const pool = require("../database");

class Capability {
	static async rodsFromGodInsert(gameId, gameTeam, selectedPositionId) {
		//TODO: this could be 1 query if efficient and do something with UNIQUE or INSERT IGNORE or REPLACE
		//keeping it simple for now to ensure it works
		let queryString = "SELECT * FROM rodsFromGod WHERE gameId = ? AND teamId = ? AND positionId = ?";
		const inserts = [gameId, gameTeam, selectedPositionId];
		let [results] = await pool.query(queryString, inserts);

		//prevent duplicate entries if possible
		if (results.length !== 0) {
			return false;
		}

		queryString = "INSERT INTO rodsFromGod (gameId, teamId, positionId) VALUES (?, ?, ?)";
		await pool.query(queryString, inserts);
		return true;
	}

	static async getRodsFromGod(gameId, gameTeam) {
		const queryString = "SELECT * FROM rodsFromGod WHERE gameId = ? AND teamId = ?";
		const inserts = [gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);

		let listOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			listOfPositions.push(results[x].positionId);
		}

		return listOfPositions;
	}

	static async useRodsFromGod(gameId) {
		let queryString = "SELECT * FROM rodsFromGod WHERE gameId = ?";
		let inserts = [gameId];
		const [results] = await pool.query(queryString, inserts);

		if (results.length === 0) {
			return [];
		}

		//need the positions anyway to give back to the clients for updating
		let fullListOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			fullListOfPositions.push(results[x].positionId);
		}

		//now delete pieces with this position
		queryString = "DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)";
		inserts = [gameId, fullListOfPositions];
		await pool.query(queryString, inserts);

		//delete the rodsFromGod in the db
		queryString = "DELETE FROM rodsFromGod WHERE gameId = ?";
		inserts = [gameId];
		await pool.query(queryString, inserts);

		return fullListOfPositions;
	}

	//TODO: better naming convention for these methods
	static async insurgencyInsert(gameId, gameTeam, selectedPositionId) {
		//TODO: this could be 1 query if efficient and do something with UNIQUE or INSERT IGNORE or REPLACE
		//keeping it simple for now to ensure it works
		let queryString = "SELECT * FROM insurgency WHERE gameId = ? AND teamId = ? AND positionId = ?";
		const inserts = [gameId, gameTeam, selectedPositionId];
		let [results] = await pool.query(queryString, inserts);

		//prevent duplicate entries if possible
		if (results.length !== 0) {
			return false;
		}

		queryString = "INSERT INTO insurgency (gameId, teamId, positionId) VALUES (?, ?, ?)";
		await pool.query(queryString, inserts);
		return true;
	}

	static async getInsurgency(gameId, gameTeam) {
		const queryString = "SELECT * FROM insurgency WHERE gameId = ? AND teamId = ?";
		const inserts = [gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);

		let listOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			listOfPositions.push(results[x].positionId);
		}

		return listOfPositions;
	}

	static async useInsurgency(gameId) {
		let queryString = "SELECT * FROM insurgency WHERE gameId = ?";
		let inserts = [gameId];
		const [results] = await pool.query(queryString, inserts);

		//TODO: make this more efficient using bulk selects/updates/deletes

		let listOfPiecesToKill = [];
		let listOfPieceIdsToKill = [];
		let listOfEffectedPositions = [];

		if (results.length === 0) {
			return { listOfPiecesToKill, listOfEffectedPositions };
		}

		//for each insurgency
		for (let x = 0; x < results.length; x++) {
			let { teamId, positionId } = results[x];
			listOfEffectedPositions.push(positionId);
			let otherTeam = teamId === 0 ? 1 : 0;

			queryString = "SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId = ?";
			inserts = [gameId, otherTeam, positionId];
			let [pieceResults] = await pool.query(queryString, inserts);

			//for each piece
			for (let y = 0; y < pieceResults.length; y++) {
				let thisPiece = pieceResults[y];
				let { pieceId } = thisPiece;
				//TODO: refactor to use constant to calculate the random chance (use a percentage?) in case this chance needs to be changed later (./gameConstants)
				let randomChance = Math.floor(Math.random() * 3) + 1;
				//randomChance is either 1, 2, or 3
				if (randomChance === 2) {
					listOfPieceIdsToKill.push(pieceId);
					listOfPiecesToKill.push(thisPiece);
				}
			}
		}

		if (listOfPieceIdsToKill.length > 0) {
			queryString = "DELETE FROM pieces WHERE pieceId in (?)";
			inserts = [listOfPieceIdsToKill];
			await pool.query(queryString, inserts);
		}

		queryString = "DELETE FROM insurgency WHERE gameId = ?";
		inserts = [gameId];
		await pool.query(queryString, inserts);

		return { listOfPiecesToKill, listOfEffectedPositions };
	}

	static async remoteSensingInsert(gameId, gameTeam, selectedPositionId) {
		let queryString = "SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ? AND positionId = ?";
		let inserts = [gameId, gameTeam, selectedPositionId];
		let [results] = await pool.query(queryString, inserts);

		//prevent duplicate entries if possible
		if (results.length !== 0) {
			return false;
		}

		queryString = "INSERT INTO remoteSensing (gameId, teamId, positionId, roundsLeft) VALUES (?, ?, ?, ?)";
		inserts = [gameId, gameTeam, selectedPositionId, 9]; //TODO: use a constant, not 9 (9 rounds for remote sensing...)
		await pool.query(queryString, inserts);
		return true;
	}

	static async getRemoteSensing(gameId, gameTeam) {
		const queryString = "SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ?";
		const inserts = [gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);

		let listOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			listOfPositions.push(results[x].positionId);
		}

		return listOfPositions;
	}

	static async decreaseRemoteSensing(gameId) {
		//TODO: probably a more efficient way of doing this (single request...)
		let queryString = "UPDATE remoteSensing SET roundsLeft = roundsLeft - 1 WHERE gameId = ?;";
		const inserts = [gameId];
		await pool.query(queryString, inserts);

		queryString = "DELETE FROM remoteSensing WHERE roundsLeft = 0";
		await pool.query(queryString);
	}

	static async insertBiologicalWeapons(gameId, gameTeam, selectedPositionId) {
		let queryString = "SELECT * FROM biologicalWeapons WHERE gameId = ? AND teamId = ? AND positionId = ?";
		let inserts = [gameId, gameTeam, selectedPositionId];
		let [results] = await pool.query(queryString, inserts);

		//prevent duplicate entries if possible
		if (results.length !== 0) {
			return false;
		}

		queryString = "INSERT INTO biologicalWeapons (gameId, teamId, positionId, roundsLeft) VALUES (?, ?, ?, ?)";
		inserts = [gameId, gameTeam, selectedPositionId, 9]; //TODO: use a constant, not 9 (9 rounds for bio weapons...)
		await pool.query(queryString, inserts);
		return true;
	}

	static async getBiologicalWeapons(gameId, gameTeam) {
		//get this team's bio weapons, and all team's activated bio weapons
		//what positions are currently toxic (planned to be toxic?)
		//happens in the same timeframe as rods from god, but sticks around...could be complicated with separating from plannedBio and activeBio
		//probably keep the same for now, keep it simple and upgrade it later. Since upgrading is easy due to good organize functions now.

		//TODO: maybe use a constant for activated = ACTIVATED_CONSTANT but seems not needed
		const queryString = "SELECT * FROM biologicalWeapons WHERE gameId = ? AND (activated = 1 OR teamId = ?)";
		const inserts = [gameId, gameTeam];
		const [results] = await pool.query(queryString, inserts);

		let listOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			listOfPositions.push(results[x].positionId);
		}

		return listOfPositions;
	}

	static async useBiologicalWeapons(gameId) {
		//take inactivated biological weapons and activate them?, let clients know which positions are toxic
		let queryString = "UPDATE biologicalWeapons SET activated = 1 WHERE gameId = ?";
		let inserts = [gameId];
		await pool.query(queryString, inserts);

		queryString = "SELECT * FROM biologicalWeapons WHERE gameId = ?"; //all should be activated, no need to specify
		inserts = [gameId];
		const [results] = await pool.query(queryString, inserts);

		if (results.length === 0) {
			return [];
		}

		//need the positions anyway to give back to the clients for updating
		let fullListOfPositions = [];
		for (let x = 0; x < results.length; x++) {
			fullListOfPositions.push(results[x].positionId);
		}

		if (fullListOfPositions.length > 0) {
			//now delete pieces with this position
			queryString = "DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)";
			inserts = [gameId, fullListOfPositions];
			await pool.query(queryString, inserts);
		}

		return fullListOfPositions;
	}

	static async decreaseBiologicalWeapons(gameId) {
		//roundsLeft--
		let queryString = "UPDATE biologicalWeapons SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = 1";
		const inserts = [gameId];
		await pool.query(queryString, inserts);

		queryString = "DELETE FROM biologicalWeapons WHERE roundsLeft = 0";
		await pool.query(queryString);
	}
}

module.exports = Capability;
