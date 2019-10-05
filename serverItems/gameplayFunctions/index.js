//Collect all functions into a single file for use in socketSetup.js

const sendUserFeedback = require("./sendUserFeedback");
const shopPurchaseRequest = require("./shopPurchaseRequest");
const shopRefundRequest = require("./shopRefundRequest");
const shopConfirmPurchase = require("./shopConfirmPurchase");
const confirmPlan = require("./confirmPlan");
const deletePlan = require("./deletePlan");
const piecePlace = require("./piecePlace");
const mainButtonClick = require("./mainButtonClick");
const confirmBattleSelection = require("./confirmBattleSelection");

module.exports = { shopPurchaseRequest, sendUserFeedback, shopRefundRequest, shopConfirmPurchase, confirmPlan, deletePlan, piecePlace, mainButtonClick, confirmBattleSelection };
