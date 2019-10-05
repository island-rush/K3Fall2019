const pool = require("../database");
const gameInitialPieces = require("./gameInitialPieces"); //script to insert pieces
const gameInitialNews = require("./gameInitialNews"); //script to insert news
const CONSTANTS = require("../constants");

const InvItem = require("./InvItem");
const ShopItem = require("./ShopItem");
const Piece = require("./Piece");
const Plan = require("./Plan");
const Event = require("./Event");

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
		const invItems = await InvItem.all(this.gameId, gameTeam);
		const shopItems = await ShopItem.all(this.gameId, gameTeam);
		const gameboardPieces = await Piece.getVisiblePieces(this.gameId, gameTeam);
		const confirmedPlans = await Plan.getConfirmedPlans(this.gameId, gameTeam);

		//Could put news into its own object, but don't really use it much...(TODO: figure out if need to refactor this...)
		let queryString = "SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? AND newsActivated = 1 AND newsLength != 0 ORDER BY newsOrder ASC LIMIT 1";
		let inserts = [this.gameId];
		const [resultNews] = await pool.query(queryString, inserts);
		const { newsTitle, newsInfo } = resultNews[0] !== undefined ? resultNews[0] : { newsTitle: "No More News", newsInfo: "Obviously you've been playing this game too long..." };
		const news = {
			active: parseInt(this.gamePhase) == 0,
			// active: false,
			newsTitle,
			newsInfo
		};

		//TODO: get these values from the database (potentially throw this into the event object)
		const currentEvent = await Event.getNext(this.gameId, gameTeam);

		let battle = {
			selectedBattlePiece: -1,
			selectedBattlePieceIndex: -1,
			masterRecord: null
		};

		if (currentEvent) {
			//TODO: don't assume its a battle, handle according to event type
			let friendlyPiecesList = await currentEvent.getTeamItems(gameTeam == 0 ? 0 : 1);
			let enemyPiecesList = await currentEvent.getTeamItems(gameTeam == 0 ? 1 : 0);
			let friendlyPieces = [];
			let enemyPieces = [];

			//formatting for the frontend
			for (let x = 0; x < friendlyPiecesList.length; x++) {
				//need to transform pieces and stuff...
				let thisFriendlyPiece = {
					piece: {
						pieceId: friendlyPiecesList[x].pieceId,
						pieceGameId: friendlyPiecesList[x].pieceGameId,
						pieceTeamId: friendlyPiecesList[x].pieceTeamId,
						pieceTypeId: friendlyPiecesList[x].pieceTypeId,
						piecePositionId: friendlyPiecesList[x].piecePositionId,
						pieceVisible: friendlyPiecesList[x].pieceVisible,
						pieceMoves: friendlyPiecesList[x].pieceMoves,
						pieceFuel: friendlyPiecesList[x].pieceFuel
					},
					targetPiece:
						friendlyPiecesList[x].tpieceId == null
							? null
							: {
									pieceId: friendlyPiecesList[x].tpieceId,
									pieceGameId: friendlyPiecesList[x].tpieceGameId,
									pieceTeamId: friendlyPiecesList[x].tpieceTeamId,
									pieceTypeId: friendlyPiecesList[x].tpieceTypeId,
									piecePositionId: friendlyPiecesList[x].tpiecePositionId,
									pieceVisible: friendlyPiecesList[x].tpieceVisible,
									pieceMoves: friendlyPiecesList[x].tpieceMoves,
									pieceFuel: friendlyPiecesList[x].tpieceFuel
							  }
				};
				friendlyPieces.push(thisFriendlyPiece);
			}
			for (let y = 0; y < enemyPiecesList.length; y++) {
				let thisEnemyPiece = {
					targetPiece: null,
					targetPieceIndex: -1
				};
				thisEnemyPiece.piece = enemyPiecesList[y];
				enemyPieces.push(thisEnemyPiece);
			}

			//now need to get the targetPieceIndex from the thing....if needed....
			for (let z = 0; z < friendlyPieces.length; z++) {
				if (friendlyPieces[z].targetPiece != null) {
					const { pieceId } = friendlyPieces[z].targetPiece;

					friendlyPieces[z].targetPieceIndex = enemyPieces.findIndex(enemyPieceThing => enemyPieceThing.piece.pieceId == pieceId);
				}
			}

			Object.assign(battle, { active: true, friendlyPieces, enemyPieces });
		} else {
			Object.assign(battle, { active: false, friendlyPieces: [], enemyPieces: [] });
		}

		//TODO: throw these within the above event handler when ready to use them...
		const container = {
			active: false
		};

		const refuel = {
			active: false
		};

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
					gameStatus: this["game" + gameTeam + "Status"],
					gamePoints: this["game" + gameTeam + "Points"]
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

		const thisGame = await new Game({ gameSection, gameInstructor }).init(); //could not init, but since we don't know who is using this function, return the full game

		//reset the game when its created, now only need to activate, reset is more in tune with the name (instead of initialize?)
		const conn = await pool.getConnection();
		await gameInitialPieces(conn, thisGame.gameId);
		await gameInitialNews(conn, thisGame.gameId);
		conn.release();

		return thisGame;
	}

	static async getGames() {
		const queryString = "SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
		const [results] = await pool.query(queryString);
		return results;
	}
}

module.exports = Game;
