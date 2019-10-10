//Collect all functions into a single file for use in socketSetup.js

const shopPurchaseRequest = require("./shop/shopPurchaseRequest");
const shopRefundRequest = require("./shop/shopRefundRequest");
const shopConfirmPurchase = require("./shop/shopConfirmPurchase");

const confirmPlan = require("./planning/confirmPlan");
const deletePlan = require("./planning/deletePlan");

const confirmBattleSelection = require("./battles/confirmBattleSelection");

const sendUserFeedback = require("./sendUserFeedback");
const piecePlace = require("./piecePlace");
const mainButtonClick = require("./mainButtonClick");

const BOTH_TEAMS_INDICATOR = 2;
const POS_BATTLE_EVENT_TYPE = 1;
const COL_BATTLE_EVENT_TYPE = 0;

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
	BOTH_TEAMS_INDICATOR,
	POS_BATTLE_EVENT_TYPE,
	COL_BATTLE_EVENT_TYPE
};
