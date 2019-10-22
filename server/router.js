/**
 * Express Router for handling all paths (routes) to server from client.
 * Checks session for authorization to each path
 * For accessing pages and handling AJAX requests
 */

const path = require("path");
import { DATABASE_TAG, LOGIN_TAG } from "./pages/errorTypes";
const {
	gameReset,
	toggleGameActive,
	getGameActive,
	getGames,
	insertDatabaseTables,
	gameDelete,
	gameAdd,
	gameLoginVerify,
	adminLoginVerify,
	databaseStatus
} = require("./adminFunctions");

const router = require("express").Router();

// --------------------------------------
// Sending Files
// --------------------------------------

router.get("/", (req, res) => {
	delete req.session.ir3; //anyone on the homepage is considered un-authenticated (doesn't maintain session) (could cause errors when they visit, with another game tab open?)
	res.sendFile(__dirname + "/pages/index.html");
});

router.get("/index.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/pages/index.html");
});

router.get("/troubleshoot.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/pages/troubleshoot.html");
});

router.get("/credits.html", (req, res) => {
	delete req.session.ir3;
	res.sendFile(__dirname + "/pages/credits.html");
});

router.get("/teacher.html", (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
		res.redirect(`/index.html?error=${LOGIN_TAG}`);
		return;
	}

	res.sendFile(__dirname + "/pages/teacher.html");
});

router.get("/courseDirector.html", (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(`/index.html?error=${LOGIN_TAG}`);
		return;
	}

	res.sendFile(__dirname + "/pages/courseDirector.html");
});

router.get("/game.html", (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.gameId || !req.session.ir3.gameTeam || !req.session.ir3.gameController) {
		res.redirect(`/index.html?error=${LOGIN_TAG}`);
		return;
	}

	if (process.env.NODE_ENV == "production") {
		res.sendFile(path.join(__dirname, "/../client/build/index.html"));
	} else {
		res.redirect("http://localhost:3000"); // Use this redirect while working on react frontend
	}
});

// --------------------------------------
// Admin Functions (forms, logins, ajax)
// --------------------------------------

router.get("/databaseStatus", (req, res) => {
	try {
		databaseStatus(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.code);
	}
});

router.post("/adminLoginVerify", (req, res) => {
	try {
		adminLoginVerify(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).redirect(`/index.html?error=${DATABASE_TAG}`);
	}
});

router.post("/gameLoginVerify", (req, res) => {
	try {
		gameLoginVerify(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).redirect(`./index.html?error=${DATABASE_TAG}`);
	}
});

router.post("/gameAdd", (req, res) => {
	try {
		gameAdd(req, res);
	} catch (error) {
		console.error(error);
		res.redirect(500, "/courseDirector.html?gameAdd=failed");
	}
});

router.post("/gameDelete", (req, res) => {
	try {
		gameDelete(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).redirect("/courseDirector.html?gameDelete=failed");
	}
});

router.post("/insertDatabaseTables", (req, res) => {
	try {
		insertDatabaseTables(req, res);
	} catch (error) {
		console.error(error);
		res.redirect("/courseDirector.html?initializeDatabase=failed");
	}
});

router.get("/getGames", (req, res) => {
	getGames(req, res); //try / catch is within this function, higher level catch didn't catch :(
});

router.get("/getGameActive", (req, res) => {
	try {
		getGameActive(req, res);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

router.post("/toggleGameActive", (req, res) => {
	try {
		toggleGameActive(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).redirect("/teacher.html?gameReset=failed");
	}
});

router.post("/gameReset", (req, res) => {
	try {
		gameReset(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).redirect("/teacher.html?gameReset=failed");
	}
});

module.exports = router;
