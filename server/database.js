const mysql = require("mysql2/promise");

// Normal Defaults
const host = process.env.DB_HOSTNAME || "localhost";
const user = process.env.DB_USERNAME || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "X0MOPhjMXL";

// Personal Dev Database Defaults
// const host = process.env.DB_HOSTNAME || "remotemysql.com";
// const user = process.env.DB_USERNAME || "X0MOPhjMXL";
// const password = process.env.DB_PASSWORD || "1bhg03PyGl";
// const database = process.env.DB_NAME || "X0MOPhjMXL";

const databaseConfig = {
	connectionLimit: 25,
	host,
	user,
	password,
	database,
	multipleStatements: true //it allows for SQL injection attacks if values are not properly escaped
};

let pool = mysql.createPool(databaseConfig);

module.exports = pool;
