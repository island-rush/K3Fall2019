const mysql = require("mysql2");

// Normal Defaults
// const DatabaseHostname = process.env.DB_HOSTNAME || "localhost";
// const DatabaseUsername = process.env.DB_USERNAME || "root";
// const DatabasePassword = process.env.DB_PASSWORD || "";
// const DatabaseName = process.env.DB_NAME || "k3";

// Personal Dev Database Defaults
const DatabaseHostname = process.env.DB_HOSTNAME || "remotemysql.com";
const DatabaseUsername = process.env.DB_USERNAME || "X0MOPhjMXL";
const DatabasePassword = process.env.DB_PASSWORD || "1bhg03PyGl";
const DatabaseName = process.env.DB_NAME || "X0MOPhjMXL";

const databaseConfig = {
	connectionLimit: 10,
	host: DatabaseHostname,
	user: DatabaseUsername,
	password: DatabasePassword,
	database: DatabaseName,
	multipleStatements: true //it allows for SQL injection attacks if values are not properly escaped
};
let pool = mysql.createPool(databaseConfig);

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			console.error("Database connection was closed.");
		}
		if (err.code === "ER_CON_COUNT_ERROR") {
			console.error("Database has too many connections.");
		}
		if (err.code === "ECONNREFUSED") {
			console.error("Database connection was refused.");
		}
	}

	if (connection) connection.release();

	return;
});

module.exports = pool;
