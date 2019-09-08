const path = require("path");
const backendServices = require("./backendServices");
const CONSTANTS = require("./constants");

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
	delete req.session.ir3;
	res.sendFile(__dirname + "/routes/troubleshoot.html");
});

router.get("/credits.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/routes/credits.html");
});

router.get("/teacher.html", (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.redirect(`/index.html?error=${CONSTANTS.LOGIN_TAG}`);
		return;
	}

	res.sendFile(__dirname + "/routes/teacher.html");
});

router.get("/courseDirector.html", (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(`/index.html?error=${CONSTANTS.LOGIN_TAG}`);
		return;
	}

	res.sendFile(__dirname + "/routes/courseDirector.html");
});

router.get("/game.html", (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.gameId || !req.session.ir3.gameTeam || !req.session.ir3.gameController) {
		res.redirect(`/index.html?error=${CONSTANTS.LOGIN_TAG}`);
		return;
	}

	if (process.env.NODE_ENV === "production") {
		res.sendFile(path.join(__dirname, "/../client/build/index.html"));
	} else {
		res.redirect("http://localhost:3000"); // Use this redirect while working on react frontend
	}
});

//Best practice is to not pass web layer (express) to business logic, and instead use custom context object...but this is simple enough for our use
router.get("/databaseStatus", (req, res) => {
	backendServices.databaseStatus(req, res);
});

router.post("/adminLoginVerify", async (req, res) => {
	backendServices.adminLoginVerify(req, res);
});

router.post("/gameLoginVerify", (req, res) => {
	backendServices.gameLoginVerify(req, res);
});

router.post("/gameAdd", (req, res) => {
	backendServices.gameAdd(req, res);
});

router.post("/gameDelete", (req, res) => {
	backendServices.gameDelete(req, res);
});

router.post("/insertDatabaseTables", (req, res) => {
	backendServices.insertDatabaseTables(req, res);
});

router.get("/getGames", (req, res) => {
	backendServices.getGames(req, res);
});

router.get("/getGameActive", (req, res) => {
	backendServices.getGameActive(req, res);
});

router.post("/toggleGameActive", (req, res) => {
	backendServices.toggleGameActive(req, res);
});

router.post("/gameReset", (req, res) => {
	backendServices.gameReset(req, res);
});

module.exports = router;
