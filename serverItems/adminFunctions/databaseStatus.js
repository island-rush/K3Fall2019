const pool = require("../database");

const databaseStatus = async (req, res) => {
	const conn = await pool.getConnection();
	res.send("Connected");
	conn.release();
};

module.exports = databaseStatus;
