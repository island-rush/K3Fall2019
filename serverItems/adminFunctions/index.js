//Collect all functions into a single file for use in router.js

const gameReset = require("./gameReset");
const toggleGameActive = require("./toggleGameActive");
const getGameActive = require("./getGameActive");
const getGames = require("./getGames");
const insertDatabaseTables = require("./insertDatabaseTables");
const gameDelete = require("./gameDelete");
const gameAdd = require("./gameAdd");
const gameLoginVerify = require("./gameLoginVerify");
const adminLoginVerify = require("./adminLoginVerify");
const databaseStatus = require("./databaseStatus");

module.exports = { gameReset, toggleGameActive, getGameActive, getGames, insertDatabaseTables, gameDelete, gameAdd, gameLoginVerify, adminLoginVerify, databaseStatus };
