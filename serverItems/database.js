const mysql = require("mysql2/promise");

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

module.exports = pool;
