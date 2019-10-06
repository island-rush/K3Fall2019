const pool = require("../database");
const fs = require("fs");
import { BAD_SESSION } from "../../client/src/redux/actions/types";

const insertDatabaseTables = async (req, res) => {
	if (!req.session.ir3 || !req.session.ir3.courseDirector) {
		res.redirect(`/index.html?error=${BAD_SESSION}`);
		return;
	}

	const queryString = fs.readFileSync("./server/sql/tableInsert.sql").toString();
	await pool.query(queryString);
	res.redirect("/courseDirector.html?initializeDatabase=success");
};

module.exports = insertDatabaseTables;
