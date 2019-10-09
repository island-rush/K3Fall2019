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

module.exports = { shopPurchaseRequest, sendUserFeedback, shopRefundRequest, shopConfirmPurchase, confirmPlan, deletePlan, piecePlace, mainButtonClick, confirmBattleSelection };
