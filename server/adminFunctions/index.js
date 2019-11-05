/**
 * Collect all functions into a single file for use in router.js
 */

const gameReset = require("./gameReset");
const toggleGameActive = require("./toggleGameActive");
const getGameActive = require("./getGameActive");
const getGames = require("./getGames");
const insertDatabaseTables = require("./insertDatabaseTables");
const gameDelete = require("./gameDelete");
const passwordUpdate = require("./passwordUpdate");
const teacherPwdUpdate = require("./teacherPwdUpdate");
const gameAdd = require("./gameAdd");
const gameLoginVerify = require("./gameLoginVerify");
const adminLoginVerify = require("./adminLoginVerify");
const databaseStatus = require("./databaseStatus");

module.exports = {
	gameReset,
	toggleGameActive,
	getGameActive,
	getGames,
	insertDatabaseTables,
	gameDelete,
	passwordUpdate,
	teacherPwdUpdate,
	gameAdd,
	gameLoginVerify,
	adminLoginVerify,
	databaseStatus
};
