const pool = require("./database");
const initialPieces = require("./initialPieces"); //script to insert pieces
const initialNews = require("./initialNews"); //script to insert news

class Game {
	//TODO: could overload this with the init, to get rid of the findGameId static method (by using parameter options / hash, and manually check)
	constructor(gameId) {
		this.gameId = gameId;
	}

	async init() {
		const queryString = "SELECT * FROM games WHERE gameId = ?";
		const inserts = [this.gameId];
		const [results] = await pool.query(queryString, inserts);
		Object.assign(this, results[0]);
	}

	static async delete(gameId) {
		const queryString = "DELETE FROM games WHERE gameId = ?";
		const inserts = [gameId];
		await pool.query(queryString, inserts);
	}

	static async add(gameSection, gameInstructor, gameAdminPasswordHash) {
		const queryString = "INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)";
		const inserts = [gameSection, gameInstructor, gameAdminPasswordHash];
		await pool.query(queryString, inserts);
	}

	static async findGameId(gameSection, gameInstructor) {
		const queryString = "SELECT gameId FROM games WHERE gameSection = ? AND gameInstructor = ?";
		const inserts = [gameSection, gameInstructor];
		const [results, fields] = await pool.query(queryString, inserts);
		if (results.length === 1) {
			return results[0]["gameId"];
		} else {
			return null;
		}
	}

	static async getGames() {
		const queryString = "SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
		const [results] = await pool.query(queryString);
		return results;
	}

	async initialStatePayload(gameTeam, gameController) {
		let queryString = "";
		let inserts = [];

		const conn = await pool.getConnection();

		queryString = "SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
		inserts = [this.gameId, gameTeam];
		const [invItems] = await conn.query(queryString, inserts);

		queryString = "SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
		inserts = [this.gameId, gameTeam];
		const [shopItems] = await conn.query(queryString, inserts);

		queryString = "SELECT * FROM pieces WHERE pieceGameId = ? AND (pieceTeamId = ? OR pieceVisible = 1) ORDER BY pieceContainerId, pieceTeamId ASC";
		inserts = [this.gameId, gameTeam];
		const [resultPieces] = await conn.query(queryString, inserts);

		let gameboardPieces = {};
		for (let x = 0; x < resultPieces.length; x++) {
			let currentPiece = resultPieces[x];
			currentPiece.pieceContents = { pieces: [] };
			if (!gameboardPieces[currentPiece.piecePositionId]) {
				gameboardPieces[currentPiece.piecePositionId] = [];
			}
			if (currentPiece.pieceContainerId === -1) {
				gameboardPieces[currentPiece.piecePositionId].push(currentPiece);
			} else {
				let indexOfParent = gameboardPieces[currentPiece.piecePositionId].findIndex(piece => {
					return piece.pieceId === currentPiece.pieceContainerId;
				});
				gameboardPieces[currentPiece.piecePositionId][indexOfParent].pieceContents.push(currentPiece);
			}
		}

		queryString = "SELECT * FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planPieceId, planMovementOrder ASC";
		inserts = [this.gameId, gameTeam];
		const [resultPlans] = await conn.query(queryString, inserts);

		let confirmedPlans = {};

		for (let x = 0; x < resultPlans.length; x++) {
			let { planPieceId, planPositionId, planSpecialFlag } = resultPlans[x];
			let type = planSpecialFlag === 0 ? "move" : "container"; //TODO: unknown future special flags could interfere

			if (!(planPieceId in confirmedPlans)) {
				confirmedPlans[planPieceId] = [];
			}

			confirmedPlans[planPieceId].push({
				type,
				positionId: planPositionId
			});
		}

		queryString = "SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? AND newsActivated = 1 AND newsLength != 0 ORDER BY newsOrder ASC LIMIT 1";
		inserts = [this.gameId];
		const [resultNews] = await conn.query(queryString, inserts);
		const { newsTitle, newsInfo } = resultNews[0] !== undefined ? resultNews[0] : { newsTitle: "No More News", newsInfo: "Obviously you've been playing this game too long..." };
		const news = {
			active: parseInt(this.gamePhase) === 0,
			newsTitle,
			newsInfo
		};

		//fill in default values for battle object
		const battle = {
			active: false
		};

		const container = {
			active: false
		};

		const refuel = {
			active: false
		};

		await conn.release();

		const gamePoints = this["game" + gameTeam + "Points"];
		const gameStatus = this["game" + gameTeam + "Status"];

		const serverAction = {
			type: "INITIAL_GAMESTATE",
			payload: {
				gameInfo: {
					gameSection: this.gameSection,
					gameInstructor: this.gameInstructor,
					gameController,
					gamePhase: this.gamePhase,
					gameRound: this.gameRound,
					gameSlice: this.gameSlice,
					gameStatus,
					gamePoints
				},
				shopItems,
				invItems,
				gameboardPieces,
				gameboardMeta: {
					selectedPosition: -1,
					selectedPiece: -1,
					news,
					battle,
					container,
					refuel,
					planning: {
						active: false, //nothing during planning is saved by server, always defaults to this
						moves: []
					},
					confirmedPlans
				}
			}
		};

		return serverAction;
	}

	async toggleGameActive() {
		const queryString =
			"UPDATE games SET gameActive = (gameActive + 1) % 2, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?";
		const inserts = [this.gameId];
		await pool.query(queryString, inserts);
		this.gameActive = (this.gameActive + 1) % 2;
	}

	async markLoggedIn(gameTeam, gameController) {
		const queryString = "UPDATE games SET ?? = 1 WHERE gameId = ?";
		const inserts = ["game" + gameTeam + "Controller" + gameController, this.gameId];
		await pool.query(queryString, inserts); //TODO: do we need to await if this is run and forget? (don't want to release early?)
		this["game" + gameTeam + "Controller" + gameController] = 1;
	}

	async markLoggedOut(gameTeam, gameController) {
		const queryString = "UPDATE games SET ?? = 0 WHERE gameId = ?";
		const inserts = ["game" + gameTeam + "Controller" + gameController, this.gameId];
		await pool.query(queryString, inserts);
		this["game" + gameTeam + "Controller" + gameController] = 0;
	}

	async reset() {
		Game.delete(this.gameId);

		const conn = await pool.getConnection();
		const queryString = "INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?, ?)";
		const inserts = [this.gameId, this.gameSection, this.gameInstructor, this.gameAdminPassword];
		await conn.query(queryString, inserts);

		await this.init(); //re-write old object values with new defaults from db

		await initialPieces(conn, this.gameId);
		await initialNews(conn, this.gameId);

		await conn.release();
	}

	async setPoints(gameTeam, newPoints) {
		const queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
		const inserts = ["game" + gameTeam + "Points", newPoints, this.gameId];
		await pool.query(queryString, inserts);
		this["game" + gameTeam + "Points"] = newPoints;
	}

	async setStatus(gameTeam, newStatus) {
		const queryString = "UPDATE games set ?? = ? WHERE gameId = ?";
		const inserts = ["game" + parseInt(gameTeam) + "Status", parseInt(newStatus), this.gameId];
		await pool.query(queryString, inserts);
		this["game" + parseInt(gameTeam) + "Status"] = newStatus;
	}

	async setPhase(newGamePhase) {
		const queryString = "UPDATE games set gamePhase = ? WHERE gameId = ?";
		const inserts = [parseInt(newGamePhase), this.gameId];
		await pool.query(queryString, inserts);
		this.gamePhase = parseInt(newGamePhase); //TODO: when to use parseInt and when not? (overkill or not needed or randomly used...)
	}

	async setSlice(newGameSlice) {
		const queryString = "UPDATE games SET gameSlice = ? WHERE gameId = ?";
		const inserts = [parseInt(newGameSlice), this.gameId];
		await pool.query(queryString, inserts);
		this.gameSlice = parseInt(newGameSlice);
	}

	async setRound(newGameRound) {
		const queryString = "UPDATE games SET gameRound = ? WHERE gameId = ?";
		const inserts = [parseInt(newGameRound), this.gameId];
		await pool.query(queryString, inserts);
		this.gameRound = parseInt(newGameRound);
	}
}

module.exports = Game;
