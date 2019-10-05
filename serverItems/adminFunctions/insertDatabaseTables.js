const pool = require("../database");
const fs = require("fs");
const { BAD_SESSION } = require("../constants");

const insertDatabaseTables = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(`/index.html?error=${BAD_SESSION}`);
		return;
	}

	const queryString = fs.readFileSync("./serverItems/sqlScripts/tableInsert.sql").toString();
	await pool.query(queryString);
	res.redirect("/courseDirector.html?initializeDatabase=success");
};

module.exports = insertDatabaseTables;
