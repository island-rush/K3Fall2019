const typeNameIds = require("./constants").typeNameIds;
const pieceDefaultMoves = require("./constants").typeMoves;
const pieceDefaultFuel = require("./constants").typeFuel;

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
	const pieceMoves = pieceDefaultMoves[pieceTypeId];
	const pieceFuel = pieceDefaultFuel[pieceTypeId];
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

const generateDefaultPieceValues = gameId => {
	return [
		piece(gameId, "Blue", "Tank", 0),
		piece(gameId, "Blue", "Plane", 0),
		piece(gameId, "Red", "Tank", 0),
		piece(gameId, "Red", "Plane", 0),
		piece(gameId, "Blue", "Tank", 1),
		piece(gameId, "Red", "Radar", 2),
		piece(gameId, "Red", "Sub", 2),
		piece(gameId, "Red", "Plane", 2),
		piece(gameId, "Red", "Transport", 2),
		piece(gameId, "Blue", "Tank", 3)
	];
};

exports.gameReset = (mysqlPool, req, callback) => {
	//reset the game via database methods

	//callback with true or false for success

	//need to verify who is asking to

	const { gameId } = req.session.ir3;

	mysqlPool.getConnection((error, connection) => {
		//reset game to default values (known by database table)
		connection.query(
			"UPDATE games SET gameActive = DEFAULT, game0Controller0 = DEFAULT, game0Controller1 = DEFAULT, game0Controller2 = DEFAULT, game0Controller3 = DEFAULT, game1Controller0 = DEFAULT, game1Controller1 = DEFAULT, game1Controller2 = DEFAULT, game1Controller3 = DEFAULT, game0Points = DEFAULT, game1Points = DEFAULT WHERE gameId = ?",
			[gameId],
			(error, results, fields) => {
				if (error) {
					connection.release();
					callback(false);
					return;
				}
				//delete all entries in other tables relating to this game
				//need to deal with errors as they occur (or just hope they don't happen....ever)
				connection.query(
					"DELETE FROM shopItems WHERE shopItemGameId = ?",
					[gameId],
					(error, results, fields) => {
						if (error) {
							connection.release();
							callback(false);
							return;
						}
						connection.query(
							"DELETE FROM invItems WHERE invItemGameId = ?",
							[gameId],
							(error, results, fields) => {
								if (error) {
									connection.release();
									callback(false);
									return;
								}
								connection.query(
									"DELETE FROM pieces WHERE pieceGameId = ?",
									[gameId],
									(error, results, fields) => {
										if (error) {
											connection.release();
											callback(false);
											return;
										}
										//start to do the inserts
										//check for more errors probably
										defaultPieceValues = generateDefaultPieceValues(gameId);
										connection.query(
											"INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?",
											[defaultPieceValues],
											(error, results, fields) => {
												if (error) {
													connection.release();
													callback(false);
													return;
												}
												//need to insert container pieces and get inserted id from results for next piece (must do with callbacks or async***)
												//only needed if initial game has containers with pieces on the inside...
												connection.release();
												callback(true);
												return;
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	});
};
