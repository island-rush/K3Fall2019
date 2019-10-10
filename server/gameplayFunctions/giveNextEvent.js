const { Event, Piece } = require("../classes");
import { EVENT_BATTLE, NO_MORE_EVENTS } from "../../client/src/redux/actions/actionTypes";
import { SERVER_SENDING_ACTION } from "../../client/src/redux/socketEmits";
const sendUserFeedback = require("./sendUserFeedback");
const { POS_BATTLE_EVENT_TYPE, COL_BATTLE_EVENT_TYPE } = require("./");

const giveNextEvent = async (socket, options) => {
	const { gameId } = options.thisGame;

	let gameboardPiecesList; //if came from 'executeStep', send new piece locations along with actions
	if (options.executingStep) {
		gameboardPiecesList = [await Piece.getVisiblePieces(gameId, 0), await Piece.getVisiblePieces(gameId, 1)];
	}

	let serverActions = [{}, {}]; //store the actions, send at the end

	gameEvent0 = await Event.getNext(gameId, 0);
	if (gameEvent0) {
		switch (gameEvent0.eventTypeId) {
			case COL_BATTLE_EVENT_TYPE:
			case POS_BATTLE_EVENT_TYPE:
				let friendlyPiecesList = await gameEvent0.getTeamItems(0);
				let enemyPiecesList = await gameEvent0.getTeamItems(1);
				let friendlyPieces = [];
				let enemyPieces = [];

				for (let x = 0; x < friendlyPiecesList.length; x++) {
					let thisFriendlyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisFriendlyPiece.piece = friendlyPiecesList[x];
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

				serverActions[0] = {
					type: EVENT_BATTLE,
					payload: {
						friendlyPieces,
						enemyPieces,
						gameboardPieces: options.executingStep ? gameboardPiecesList[0] : null,
						gameStatus: options.executingStep ? 0 : null
					}
				};
				break;
			default:
				sendUserFeedback(socket, "Server Error, unknown event type...");
				return;
		}
	} else {
		serverActions[0] = {
			type: NO_MORE_EVENTS,
			payload: {
				gameboardPieces: options.executingStep ? gameboardPiecesList[0] : null,
				gameStatus: options.executingStep ? 0 : null
			}
		};
	}

	gameEvent1 = await Event.getNext(gameId, 1);
	if (gameEvent1) {
		switch (gameEvent1.eventTypeId) {
			case COL_BATTLE_EVENT_TYPE:
			case POS_BATTLE_EVENT_TYPE:
				let friendlyPiecesList = await gameEvent1.getTeamItems(1);
				let enemyPiecesList = await gameEvent1.getTeamItems(0);
				let friendlyPieces = [];
				let enemyPieces = [];

				for (let x = 0; x < friendlyPiecesList.length; x++) {
					let thisFriendlyPiece = {
						targetPiece: null,
						targetPieceIndex: -1
					};
					thisFriendlyPiece.piece = friendlyPiecesList[x];
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

				serverActions[1] = {
					type: EVENT_BATTLE,
					payload: {
						friendlyPieces,
						enemyPieces,
						gameboardPieces: options.executingStep ? gameboardPiecesList[1] : null,
						gameStatus: options.executingStep ? 0 : null
					}
				};
				break;
			default:
				sendUserFeedback(socket, "Server Error, unknown event type...");
				return;
		}
	} else {
		serverActions[1] = {
			type: NO_MORE_EVENTS,
			payload: {
				gameboardPieces: options.executingStep ? gameboardPiecesList[1] : null,
				gameStatus: options.executingStep ? 0 : null
			}
		};
	}

	//sending the events that we got, or "no more events"? (but also sending piece moves after this...should combine...)
	socket.to("game" + gameId + "team0").emit(SERVER_SENDING_ACTION, serverActions[0]);
	socket.to("game" + gameId + "team1").emit(SERVER_SENDING_ACTION, serverActions[1]);
	socket.emit(SERVER_SENDING_ACTION, serverActions[socket.handshake.session.ir3.gameTeam]);
};

module.exports = giveNextEvent;
