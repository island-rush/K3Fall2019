// ----------------------------------------------------------------------------------------
// Server Setup and Configuration
// ----------------------------------------------------------------------------------------

const port = process.env.PORT || 80;
const DatabaseHostname = process.env.DB_HOSTNAME || "localhost";
const DatabaseUsername = process.env.DB_USERNAME || "root";
const DatabasePassword = process.env.DB_PASSWORD || "";
const DatabaseName = process.env.DB_NAME || "k3";
const sessionSecret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";
const productionEnv = process.env.PRODUCTION_ENV || false;

const backendServices = require("./server/backendServices.js");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const esConfig = {
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true
};
const session = require("express-session")(esConfig);
const sharedsession = require("express-socket.io-session");
app.use(session);
app.use(express.urlencoded());
io.use(sharedsession(session));

const mysql = require("mysql");
const databaseConfig = {
	connectionLimit: 10,
	host: DatabaseHostname,
	user: DatabaseUsername,
	password: DatabasePassword,
	database: DatabaseName,
	multipleStatements: true //it allows for SQL injection attacks if values are not properly escaped
};
let mysqlPool = mysql.createPool(databaseConfig);

const csvparse = require("csv-array");
let distanceMatrix = [];
csvparse.parseCSV(
	"./server/distanceMatrix.csv",
	data => {
		distanceMatrix = data;
	},
	false
);

// ----------------------------------------------------------------------------------------
// Internal Routing (unrestricted access)
// ----------------------------------------------------------------------------------------

app.get("/", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/server/routes/index.html");
});

app.get("/index.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/server/routes/index.html");
});

app.get("/troubleshoot.html", (req, res) => {
	res.sendFile(__dirname + "/server/routes/troubleshoot.html");
});

app.get("/credits.html", (req, res) => {
	res.sendFile(__dirname + "/server/routes/credits.html");
});

app.get("/databaseStatus", (req, res) => {
	backendServices.databaseStatus(mysqlPool, req, result => {
		res.send(result ? "Success" : "Failed");
	});
});

// ----------------------------------------------------------------------------------------
// Teacher and Course Director Services / Routing
// ----------------------------------------------------------------------------------------

app.get("/teacher.html", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher) {
		res.sendFile(__dirname + "/server/routes/teacher.html");
	} else {
		res.redirect("/index.html?error=login");
	}
});

app.get("/courseDirector.html", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		res.sendFile(__dirname + "/server/routes/courseDirector.html");
	} else {
		res.redirect("/index.html?error=login");
	}
});

app.post("/adminLoginVerify", (req, res) => {
	backendServices.adminLoginVerify(mysqlPool, req, result => {
		res.redirect(result);
	});
});

app.post("/gameAdd", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		backendServices.gameAdd(mysqlPool, req, result => {
			res.redirect(
				`/courseDirector.html?gameAdd=${result ? "success" : "failed"}`
			);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.post("/gameDelete", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		backendServices.gameDelete(mysqlPool, req, result => {
			res.redirect(
				`/courseDirector.html?gameDelete=${result ? "success" : "failed"}`
			);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.post("/insertDatabaseTables", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		backendServices.insertDatabaseTables(mysqlPool, req, result => {
			res.redirect(`/courseDirector.html?initializeDatabase=${result}`);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.get("/getGames", (req, res) => {
	if (
		req.session.ir3 &&
		(req.session.ir3.teacher || req.session.ir3.courseDirector)
	) {
		backendServices.getGames(mysqlPool, req, result => {
			res.send(result);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.get("/getGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.getGameActive(mysqlPool, req, result => {
			res.send(JSON.stringify(result));
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.post("/toggleGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.toggleGameActive(mysqlPool, req, result => {});
	} else {
		res.redirect("/index.html?error=access");
	}
});

// ----------------------------------------------------------------------------------------
// Game Routing (Into React App)
// ----------------------------------------------------------------------------------------

app.post("/gameLoginVerify", (req, res) => {
	backendServices.gameLoginVerify(mysqlPool, req, result => {
		res.redirect(result);
	});
});

app.get("/game.html", (req, res) => {
	if (
		req.session.ir3 &&
		req.session.ir3.gameId &&
		req.session.ir3.gameTeam &&
		req.session.ir3.gameController
	) {
		if (productionEnv) {
			res.sendFile(__dirname + "/client/build/index.html");
		} else {
			res.redirect("http://localhost:3001"); // Use this redirect while working on react frontend
		}
	} else {
		res.redirect("/index.html?error=login");
	}
});

app.use(express.static(__dirname + "/client/build"));

// ----------------------------------------------------------------------------------------
// Socket Requests (Gameplay Client <-|-> Server)
// ----------------------------------------------------------------------------------------

io.sockets.on("connection", socket => {
	if (
		!socket.handshake.session.ir3 ||
		!socket.handshake.session.ir3.gameId ||
		!socket.handshake.session.ir3.gameTeam ||
		!socket.handshake.session.ir3.gameController
	) {
		socket.emit("serverRedirect", "access");
		return;
	}

	const { gameId, gameTeam, gameController } = socket.handshake.session.ir3;

	//Room for the Team
	socket.join("game" + gameId + "team" + gameTeam);

	//Room for the Indiviual Controller
	socket.join(
		"game" + gameId + "team" + gameTeam + "controller" + gameController
	);

	//Send the initial game state (TODO: Server Side Rendering)
	backendServices.socketInitialGameState(mysqlPool, socket);

	socket.on("clientSendingData", clientData => {
		backendServices.clientSendingData(mysqlPool, socket, clientData);
	});

	socket.on("disconnect", () => {
		const controllerLoginField =
			"game" + gameTeam + "Controller" + gameController;
		mysqlPool.query(
			"UPDATE games SET ?? = 0 WHERE gameId = ?",
			[controllerLoginField, gameId],
			(error, results, fields) => {
				//handle error
			}
		);
	});
});

// ----------------------------------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------------------------------

server.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
