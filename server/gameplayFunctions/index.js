/**
 * These are all the functions used by the game logic, exposed to socketSetup
 * Some functions are helpers, and used internally, and therefore not exposed (ex: ./giveNextEvent.js)
 */

const shopPurchaseRequest = require("./shop/shopPurchaseRequest");
const shopRefundRequest = require("./shop/shopRefundRequest");
const shopConfirmPurchase = require("./shop/shopConfirmPurchase");

const confirmPlan = require("./planning/confirmPlan");
const deletePlan = require("./planning/deletePlan");

const confirmBattleSelection = require("./battles/confirmBattleSelection");

const confirmFuelSelection = require("./refuel/confirmFuelSelection");

const sendUserFeedback = require("./sendUserFeedback");
const piecePlace = require("./piecePlace");
const mainButtonClick = require("./mainButtonClick");

const rodsFromGodConfirm = require("./capabilities/rodsFromGodConfirm");
const remoteSensingConfirm = require("./capabilities/remoteSensingConfirm");
const insurgencyConfirm = require("./capabilities/insurgencyConfirm");

module.exports = {
	shopPurchaseRequest,
	sendUserFeedback,
	shopRefundRequest,
	shopConfirmPurchase,
	confirmPlan,
	deletePlan,
	piecePlace,
	mainButtonClick,
	confirmBattleSelection,
	confirmFuelSelection,
	rodsFromGodConfirm,
	remoteSensingConfirm,
	insurgencyConfirm
};
