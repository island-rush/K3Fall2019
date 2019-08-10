const express = require("express");
const router = express.Router();

const productionEnv = process.env.NODE_ENV === "production";

const backendServices = require("./backendServices");

// ----------------------------------------------------------------------------------------
// Internal Routing (unrestricted access)
// ----------------------------------------------------------------------------------------

router.get("/", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/routes/index.html");
});

router.get("/index.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/routes/index.html");
});

router.get("/troubleshoot.html", (req, res) => {
	res.sendFile(__dirname + "/routes/troubleshoot.html");
});

router.get("/credits.html", (req, res) => {
	res.sendFile(__dirname + "/routes/credits.html");
});

router.get("/databaseStatus", (req, res) => {
	backendServices.databaseStatus(req, result => {
		res.send(result ? "Success" : "Failed");
	});
});

// ----------------------------------------------------------------------------------------
// Teacher and Course Director Services / Routing
// ----------------------------------------------------------------------------------------

router.get("/teacher.html", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher) {
		res.sendFile(__dirname + "/routes/teacher.html");
	} else {
		res.redirect("/index.html?error=login");
	}
});

router.get("/courseDirector.html", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		res.sendFile(__dirname + "/routes/courseDirector.html");
	} else {
		res.redirect("/index.html?error=login");
	}
});

router.post("/adminLoginVerify", (req, res) => {
	backendServices.adminLoginVerify(req, result => {
		//TODO: standardize callbacks to client (set url within / without backendServices)
		res.redirect(result);
	});
});

router.post("/gameAdd", (req, res) => {
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

router.post("/gameDelete", (req, res) => {
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

router.post("/insertDatabaseTables", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		backendServices.insertDatabaseTables(req, result => {
			res.redirect(`/courseDirector.html?initializeDatabase=${result}`);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

router.get("/getGames", (req, res) => {
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

router.get("/getGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.getGameActive(req, result => {
			res.send(JSON.stringify(result));
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

router.post("/toggleGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.toggleGameActive(req, result => {});
	} else {
		res.redirect("/index.html?error=access");
	}
});

router.post("/gameReset", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices.gameReset(req, result => {
			res.redirect(`/teacher.html?gameReset=${result ? "success" : "failed"}`);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

// ----------------------------------------------------------------------------------------
// Game Routing (Into React app)
// ----------------------------------------------------------------------------------------

router.post("/gameLoginVerify", (req, res) => {
	backendServices.gameLoginVerify(req, result => {
		res.redirect(result);
	});
});

router.get("/game.html", (req, res) => {
	if (
		req.session.ir3 &&
		req.session.ir3.gameId &&
		req.session.ir3.gameTeam &&
		req.session.ir3.gameController
	) {
		if (productionEnv) {
			res.sendFile(__dirname + "../client/build/index.html");
		} else {
			res.redirect("http://localhost:3000"); // Use this redirect while working on react frontend
		}
	} else {
		res.redirect("/index.html?error=login");
	}
});

module.exports = router;
