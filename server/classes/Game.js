const pool = require("../database");
import { INITIAL_GAMESTATE } from "../../client/src/redux/actions/actionTypes";
const { POS_BATTLE_EVENT_TYPE, COL_BATTLE_EVENT_TYPE, REFUEL_EVENT_TYPE } = require("../gameplayFunctions/eventConstants");
import { TYPE_NAMES } from "../../client/src/gameData/gameConstants";

const InvItem = require("./InvItem");
const ShopItem = require("./ShopItem");
const Piece = require("./Piece");
const Plan = require("./Plan");
const Event = require("./Event");
const Capability = require("./Capability");

const gameInitialPieces = require("../adminFunctions/gameInitialPieces");
const gameInitialNews = require("../adminFunctions/gameInitialNews");

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

	async setAdminPassword(gameAdminPassword) {
		const queryString = "UPDATE games SET gameAdminPassword = ? WHERE gameId = ?";
		const inserts = [gameAdminPassword, this.gameId];
		await pool.query(queryString, inserts);
		const updatedInfo = {
			gameAdminPassword
		};
		Object.assign(this, updatedInfo); //very unlikely we would need the updated info on this object...
	}

	async setTeamPasswords(game0Password, game1Password) {
		const queryString = "UPDATE games SET game0Password = ?, game1Password = ? WHERE gameId = ?";
		const inserts = [game0Password, game1Password, this.gameId];
		await pool.query(queryString, inserts);
		const updatedInfo = {
			game0Password,
			game1Password
		};
		Object.assign(this, updatedInfo); //very unlikely we would need the updated info on this object...
	}

	async getNextNews() {
		//Delete the old news
		let queryString = "DELETE FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1";
		let inserts = [this.gameId];
		await pool.query(queryString, inserts);

		//Grab the next news
		queryString = "SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1";
		const [resultNews] = await pool.query(queryString, inserts);
		const { newsTitle, newsInfo } = resultNews[0] !== undefined ? resultNews[0] : { newsTitle: "No More News", newsInfo: "Obviously you've been playing this game too long..." };

		return {
			active: true,
			newsTitle,
			newsInfo
		};
	}

	async initialStateAction(gameTeam, gameController) {
		let serverAction = {
			type: INITIAL_GAMESTATE,
			payload: {}
		};

		serverAction.payload.invItems = await InvItem.all(this.gameId, gameTeam);
		serverAction.payload.shopItems = await ShopItem.all(this.gameId, gameTeam);
		serverAction.payload.gameboardPieces = await Piece.getVisiblePieces(this.gameId, gameTeam);

		serverAction.payload.gameInfo = {
			gameSection: this.gameSection,
			gameInstructor: this.gameInstructor,
			gameController,
			gamePhase: this.gamePhase,
			gameRound: this.gameRound,
			gameSlice: this.gameSlice,
			gameStatus: this["game" + gameTeam + "Status"],
			gamePoints: this["game" + gameTeam + "Points"]
		};

		serverAction.payload.gameboardMeta = {};
		serverAction.payload.gameboardMeta.confirmedPlans = await Plan.getConfirmedPlans(this.gameId, gameTeam);
		serverAction.payload.gameboardMeta.confirmedRods = await Capability.getRodsFromGod(this.gameId, gameTeam);
		serverAction.payload.gameboardMeta.confirmedRemoteSense = await Capability.getRemoteSensing(this.gameId, gameTeam);
		serverAction.payload.gameboardMeta.confirmedInsurgency = await Capability.getInsurgency(this.gameId, gameTeam);

		//Could put news into its own object, but don't really use it much...(TODO: figure out if need to refactor this...)
		if (this.gamePhase == 0) {
			let queryString = "SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1";
			let inserts = [this.gameId];
			const [resultNews] = await pool.query(queryString, inserts);
			const { newsTitle, newsInfo } = resultNews[0] !== undefined ? resultNews[0] : { newsTitle: "No More News", newsInfo: "Obviously you've been playing this game too long..." };

			serverAction.payload.gameboardMeta.news = {
				active: true,
				newsTitle,
				newsInfo
			};
		}

		//TODO: get these values from the database (potentially throw this into the event object)
		//TODO: current event could be a refuel (or something else...need to handle all of them, and set other states as false...)
		//TODO: don't have to check if not in the combat phase...(prevent these checks for added efficiency?)
		const currentEvent = await Event.getNext(this.gameId, gameTeam);

		if (currentEvent) {
			const { eventTypeId } = currentEvent;
			switch (eventTypeId) {
				case POS_BATTLE_EVENT_TYPE:
				case COL_BATTLE_EVENT_TYPE:
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

					serverAction.payload.gameboardMeta.battle = {
						active: true,
						friendlyPieces,
						enemyPieces
					};
					break;
				case REFUEL_EVENT_TYPE:
					//need to get tankers and aircraft and put that into the payload...
					let tankers = [];
					let aircraft = [];
					const allRefuelItems = await currentEvent.getRefuelItems();

					for (let x = 0; x < allRefuelItems.length; x++) {
						let thisRefuelItem = allRefuelItems[x];
						let { pieceTypeId } = thisRefuelItem;
						if (TYPE_NAMES[pieceTypeId] == "Tanker") {
							tankers.push(thisRefuelItem);
						} else {
							aircraft.push(thisRefuelItem);
						}
					}

					serverAction.payload.gameboardMeta.refuel = {
						active: true,
						tankers,
						aircraft,
						selectedTankerPieceId: -1,
						selectedTankerPieceIndex: -1
					};
					break;
				default:
				//do nothing, unknown event type...should do something...
			}
		}

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
			queryString =
				"INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT * from games WHERE gameSection=? AND gameInstructor = ?)";
			inserts = [options.gameId, gameSection, gameInstructor, gameAdminPasswordHash, gameSection, gameInstructor];
		} else {
			queryString =
				"INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) SELECT ?,?,? WHERE NOT EXISTS(SELECT * from games WHERE gameSection=? AND gameInstructor = ?)";
			inserts = [gameSection, gameInstructor, gameAdminPasswordHash, gameSection, gameInstructor];
		}

		const result = await pool.query(queryString, inserts);
		if (result[0].affectedRows == 0) return;

		const thisGame = await new Game({ gameSection, gameInstructor }).init(); //could not init, but since we don't know who is using this function, return the full game

		//reset the game when its created, now only need to activate, reset is more in tune with the name (instead of initialize?)
		await gameInitialPieces(thisGame.gameId);
		await gameInitialNews(thisGame.gameId);

		return thisGame;
	}

	static async getGames() {
		const queryString = "SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
		const [results] = await pool.query(queryString);
		return results;
	}

	static async getAllNews(gameId) {
		const queryString = "SELECT * FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC";
		const inserts = [gameId];
		const [results] = await pool.query(queryString, inserts);
		return results;
	}
}

module.exports = Game;
