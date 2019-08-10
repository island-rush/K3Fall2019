// ----------------------------------------------------------------------------------------
// Server Setup and Configuration
// ----------------------------------------------------------------------------------------

const port = process.env.PORT || 80;

const sessionSecret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";
const productionEnv = process.env.NODE_ENV === "production";

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

const csvparse = require("csv-array");
let distanceMatrix = [];
csvparse.parseCSV(
	"./serverItems/distanceMatrix.csv",
	data => {
		distanceMatrix = data;
	},
	false
);

//Used to externalize server functions
const backendServices = require("./serverItems/backendServices.js");

// ----------------------------------------------------------------------------------------
// Internal Routing (unrestricted access)
// ----------------------------------------------------------------------------------------

//TODO: Use middleware or reverse proxy to server static files instead of res.sendFile (so that node isn't bogged down on each request)

//TODO: Put these routes in an external file? (keep the server.js file small)

app.get("/", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/serverItems/routes/index.html");
});

app.get("/index.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/serverItems/routes/index.html");
});

app.get("/troubleshoot.html", (req, res) => {
	res.sendFile(__dirname + "/serverItems/routes/troubleshoot.html");
});

app.get("/credits.html", (req, res) => {
	res.sendFile(__dirname + "/serverItems/routes/credits.html");
});

app.get("/databaseStatus", (req, res) => {
	backendServices.databaseStatus(req, result => {
		res.send(result ? "Success" : "Failed");
	});
});

// ----------------------------------------------------------------------------------------
// Teacher and Course Director Services / Routing
// ----------------------------------------------------------------------------------------

app.get("/teacher.html", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher) {
		res.sendFile(__dirname + "/serverItems/routes/teacher.html");
	} else {
		res.redirect("/index.html?error=login");
	}
});

app.get("/courseDirector.html", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		res.sendFile(__dirname + "/serverItems/routes/courseDirector.html");
	} else {
		res.redirect("/index.html?error=login");
	}
});

app.post("/adminLoginVerify", (req, res) => {
	backendServices.adminLoginVerify(req, result => {
		//TODO: standardize callbacks to client (set url within / without backendServices)
		res.redirect(result);
	});
});

app.post("/gameAdd", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		backendServices.gameAdd(req, result => {
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
		backendServices.gameDelete(req, result => {
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
		backendServices.insertDatabaseTables(req, result => {
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
		backendServices.getGames(req, result => {
			res.send(result);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.get("/getGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.getGameActive(req, result => {
			res.send(JSON.stringify(result));
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.post("/toggleGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.toggleGameActive(req, result => {});
	} else {
		res.redirect("/index.html?error=access");
	}
});

app.post("/gameReset", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.gameReset(req, result => {
			res.redirect(`/teacher.html?gameReset=${result ? "success" : "failed"}`);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

// ----------------------------------------------------------------------------------------
// Game Routing (Into React App)
// ----------------------------------------------------------------------------------------

app.post("/gameLoginVerify", (req, res) => {
	backendServices.gameLoginVerify(req, result => {
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
			res.redirect("http://localhost:3000"); // Use this redirect while working on react frontend
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

	//Send the initial game state (TODO: Server Side Rendering with react?)
	backendServices.getInitialGameState(socket);

	socket.on("shopPurchaseRequest", shopItemTypeId => {
		backendServices.shopPurchaseRequest(socket, shopItemTypeId);
	});

	socket.on("shopRefundRequest", shopItem => {
		backendServices.shopRefundRequest(socket, shopItem);
	});

	socket.on("shopConfirmPurchase", () => {
		backendServices.shopConfirmPurchase(socket);
	});

	socket.on("disconnect", () => {
		const controllerLoginField =
			"game" + gameTeam + "Controller" + gameController;
		mysqlPool.query(
			"UPDATE games SET ?? = 0 WHERE gameId = ?",
			[controllerLoginField, gameId],
			(error, results, fields) => {
				//handle error, check success?
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
