const pool = require("../database");
const gameInitialPieces = require("./gameInitialPieces"); //script to insert pieces
const gameInitialNews = require("./gameInitialNews"); //script to insert news
const CONSTANTS = require("../constants");

class Game {
	constructor(options) {
		if (options.gameId) {
			this.gameId = options.gameId;
		} else if (options.gameSection && options.gameInstructor) {
			this.gameSection = options.gameSection;
			this.gameInstructor = options.gameInstructor;
		}
	}

	async init() {
		let queryString;
		let inserts;

		if (this.gameId) {
			queryString = "SELECT * FROM games WHERE gameId = ?";
			inserts = [this.gameId];
		} else if (this.gameSection && this.gameInstructor) {
			queryString = "SELECT * FROM games WHERE gameSection = ? AND gameInstructor = ?";
			inserts = [this.gameSection, this.gameInstructor];
		}

		const [results] = await pool.query(queryString, inserts);

		if (results.length != 1) {
			return null;
		} else {
			Object.assign(this, results[0]);
			return this;
		}
	}

	async delete() {
		const queryString = "DELETE FROM games WHERE gameId = ?";
		const inserts = [this.gameId];
		await pool.query(queryString, inserts);
	}

	async initialStateAction(gameTeam, gameController) {
		const conn = await pool.getConnection();

		let queryString = "SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
		let inserts = [this.gameId, gameTeam];
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
			let type = planSpecialFlag === 0 ? "move" : planSpecialFlag === 1 ? "container" : "NULL_SPECIAL";

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
			// active: parseInt(this.gamePhase) === 0,
			active: false,
			newsTitle,
			newsInfo
		};

		//fill in default values for battle object
		// queryString = "SELECT pieceId, pieceTeamId, pieceTypeId, pieceContainerId, pieceVisible FROM eventItems NATUAL JOIN pieces WHERE ";
		// inserts = [this.gameId];
		// const [resultNews] = await conn.query(queryString, inserts);

		const battle = {
			active: true,
			selectedBattlePiece: -1,
			selectedBattlePieceIndex: -1,
			friendlyPieces: [
				{
					piece: {
						pieceId: 6969,
						pieceTeamId: 0,
						pieceTypeId: 1
					},
					targetPiece: null,
					targetPieceIndex: -1,
					diceRolled: 0
				},
				{
					piece: {
						pieceId: 6970,
						pieceTeamId: 0,
						pieceTypeId: 2
					},
					targetPiece: null,
					targetPieceIndex: -1,
					diceRolled: 0
				},
				{
					piece: {
						pieceId: 6971,
						pieceTeamId: 0,
						pieceTypeId: 3
					},
					targetPiece: null,
					targetPieceIndex: -1,
					diceRolled: 0
				}
			],
			enemyPieces: [
				{
					piece: {
						pieceId: 420,
						pieceTeamId: 1,
						pieceTypeId: 2
					},
					targetPiece: null,
					targetPieceIndex: -1,
					diceRolled: 0
				}
			]
		};

		const container = {
			active: false
		};

		const refuel = {
			active: false
		};

		conn.release();

		const gamePoints = this["game" + gameTeam + "Points"];
		const gameStatus = this["game" + gameTeam + "Status"];

		const serverAction = {
			type: CONSTANTS.INITIAL_GAMESTATE,
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

	async setGameActive(newValue) {
		const queryString =
			"UPDATE games SET gameActive = ?, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?";
		const inserts = [newValue, this.gameId];
		await pool.query(queryString, inserts);
		const updatedInfo = {
			gameActive: newValue,
			game0Controller0: 0,
			game0Controller1: 0,
			game0Controller2: 0,
			game0Controller3: 0,
			game1Controller0: 0,
			game1Controller1: 0,
			game1Controller2: 0,
			game1Controller3: 0
		};
		Object.assign(this, updatedInfo); //very unlikely we would need the updated info on this object...
	}

	async setLoggedIn(gameTeam, gameController, value) {
		const queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
		const inserts = ["game" + gameTeam + "Controller" + gameController, value, this.gameId];
		await pool.query(queryString, inserts);
		this["game" + gameTeam + "Controller" + gameController] = value;
	}

	async reset() {
		await this.delete();
		await Game.add(this.gameSection, this.gameInstructor, this.gameAdminPassword, { gameId: this.gameId });
		const conn = await pool.getConnection();
		await gameInitialPieces(conn, this.gameId);
		await gameInitialNews(conn, this.gameId);
		conn.release();
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
		const inserts = [newGamePhase, this.gameId];
		await pool.query(queryString, inserts);
		this.gamePhase = newGamePhase;
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

	//TODO: Prevent errors with 2 games sharing the same section AND instructor (would never be able to log into them...need to come back with error?)
	//Could make this part of the database schema somehow...probably by making the section + instructor a primary key instead of the gameId...(but probably too much to refactor...)
	static async add(gameSection, gameInstructor, gameAdminPasswordHash, options = {}) {
		let queryString;
		let inserts;

		if (options.gameId) {
			queryString = "INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?, ?)";
			inserts = [options.gameId, gameSection, gameInstructor, gameAdminPasswordHash];
		} else {
			queryString = "INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)";
			inserts = [gameSection, gameInstructor, gameAdminPasswordHash];
		}

		await pool.query(queryString, inserts);

		const thisGame = await new Game({ gameSection, gameInstructor }).init();
		return thisGame;
	}

	static async getGames() {
		const queryString = "SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
		const [results] = await pool.query(queryString);
		return results;
	}
}

module.exports = Game;
