const productionEnv = process.env.NODE_ENV === "production";

const backendServices = require("./backendServices");
const backendServices2 = require("./backendServices2");

const router = require("express").Router();

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

// --------------------------------------------------------

router.get("/databaseStatus", (req, res) => {
	backendServices2.databaseStatus(req, result => {
		res.send(result ? "Success" : "Failed");
	});
});

router.post("/adminLoginVerify", async (req, res) => {
	backendServices2.adminLoginVerify(req, result => {
		//TODO: standardize callbacks to client (set url within / without backendServices)
		res.redirect(result);
	});
});

router.post("/gameLoginVerify", (req, res) => {
	backendServices2.gameLoginVerify(req, result => {
		res.redirect(result);
	});
});

router.post("/gameAdd", (req, res) => {
	if (req.session.ir3 && req.session.ir3.courseDirector) {
		backendServices2.gameAdd(req, result => {
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
		backendServices2.gameDelete(req, result => {
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
		backendServices2.insertDatabaseTables(req, result => {
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
		backendServices2.getGames(req, result => {
			res.send(result);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

router.get("/getGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices2.getGameActive(req, result => {
			res.send(JSON.stringify(result));
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

router.post("/toggleGameActive", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices2.toggleGameActive(req, result => {});
	} else {
		res.redirect("/index.html?error=access");
	}
});

router.post("/gameReset", (req, res) => {
	if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
		backendServices2.gameReset2(req, result => {
			res.redirect(`/teacher.html?gameReset=${result ? "success" : "failed"}`);
		});
	} else {
		res.redirect("/index.html?error=access");
	}
});

module.exports = router;
