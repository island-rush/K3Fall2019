/**
 * Central Importing for all redux actions
 */

import battlePieceClick from "./battles/battlePieceClick";
import targetPieceClick from "./battles/targetPieceClick";
import enemyBattlePieceClick from "./battles/enemyBattlePieceClick";
import confirmBattleSelections from "./battles/confirmBattleSelections";
import clearOldBattle from "./battles/clearOldBattle";
import battlePopupMinimizeToggle from "./battles/battlePopupMinimizeToggle";

import atcScamble from "./capabilities/atcScramble";
import cyberDominance from "./capabilities/cyberDominance";
import missileLaunchDisruption from "./capabilities/missileLaunchDisruption";
import communicationsInterruption from "./capabilities/communicationsInterruption";
import remoteSensing from "./capabilities/remoteSensing";
import rodsFromGod from "./capabilities/rodsFromGod";
import antiSatelliteMissiles from "./capabilities/antiSatelliteMissiles";
import goldenEye from "./capabilities/goldenEye";
import nuclearStrike from "./capabilities/nuclearStrike";
import biologicalWeapons from "./capabilities/biologicalWeapons";
import seaMines from "./capabilities/seaMines";
import droneSwarms from "./capabilities/droneSwarms";
import insurgency from "./capabilities/insurgency";
import raiseMorale from "./capabilities/raiseMorale";

import airPieceClick from "./inv/airPieceClick";
import landPieceClick from "./inv/landPieceClick";
import seaPieceClick from "./inv/seaPieceClick";

import confirmPlan from "./planning/confirmPlan";
import startPlan from "./planning/startPlan";
import cancelPlan from "./planning/cancelPlan";
import undoMove from "./planning/undoMove";
import containerMove from "./planning/containerMove";

import confirmFuelSelections from "./refuel/confirmFuelSelections";
import aircraftClick from "./refuel/aircraftClick";
import tankerClick from "./refuel/tankerClick";
import undoFuelSelection from "./refuel/undoFuelSelection";

import shopRefundRequest from "./shop/shopRefundRequest";
import shopPurchaseRequest from "./shop/shopPurchaseRequest";
import shopConfirmPurchase from "./shop/shopConfirmPurchase";

import selectPosition from "./selectPosition";

import selectPiece from "./selectPiece";

import menuSelect from "./menuSelect";

import mainButtonClick from "./mainButtonClick";

import clearPieceSelection from "./clearPieceSelection"; //eventually replaced with menuSelect(-1) or menuSelect(0)

import newsPopupMinimizeToggle from "./newsPopupMinimizeToggle";

export {
	shopRefundRequest,
	shopPurchaseRequest,
	shopConfirmPurchase,
	selectPosition,
	selectPiece,
	confirmPlan,
	startPlan,
	cancelPlan,
	undoMove,
	menuSelect,
	battlePopupMinimizeToggle,
	mainButtonClick,
	battlePieceClick,
	targetPieceClick,
	enemyBattlePieceClick,
	confirmBattleSelections,
	clearOldBattle,
	clearPieceSelection,
	containerMove,
	confirmFuelSelections,
	tankerClick,
	aircraftClick,
	undoFuelSelection,
	newsPopupMinimizeToggle,
	airPieceClick,
	landPieceClick,
	seaPieceClick,
	atcScamble,
	cyberDominance,
	missileLaunchDisruption,
	communicationsInterruption,
	remoteSensing,
	rodsFromGod,
	antiSatelliteMissiles,
	goldenEye,
	nuclearStrike,
	biologicalWeapons,
	seaMines,
	droneSwarms,
	insurgency,
	raiseMorale
};
