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

const rodsFromGodConfirm = require("./capabilities/rodsFromGodConfirm");
const remoteSensingConfirm = require("./capabilities/remoteSensingConfirm");
const insurgencyConfirm = require("./capabilities/insurgencyConfirm");
const biologicalWeaponsConfirm = require("./capabilities/biologicalWeaponsConfirm");
const raiseMoraleConfirm = require("./capabilities/raiseMoraleConfirm");
const commInterruptConfirm = require("./capabilities/commInterruptionConfirm");
const goldenEyeConfirm = require("./capabilities/goldenEyeConfirm");

const piecePlace = require("./inv/piecePlace");

const sendUserFeedback = require("./sendUserFeedback");
const mainButtonClick = require("./mainButtonClick");

const enterContainer = require("./container/enterContainer");
const exitContainer = require("./container/exitContainer");

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
    insurgencyConfirm,
    biologicalWeaponsConfirm,
    raiseMoraleConfirm,
    commInterruptConfirm,
    goldenEyeConfirm,
    enterContainer,
    exitContainer
};
