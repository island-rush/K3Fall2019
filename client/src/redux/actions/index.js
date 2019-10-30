//puts all userActions into the same file for importing / exporting
//TODO: put these into a better organized structure (the function files) for easier access

import shopRefundRequest from "./shop/shopRefundRequest";
import shopPurchaseRequest from "./shop/shopPurchaseRequest";
import shopConfirmPurchase from "./shop/shopConfirmPurchase";

import confirmPlan from "./planning/confirmPlan";
import startPlan from "./planning/startPlan";
import cancelPlan from "./planning/cancelPlan";
import undoMove from "./planning/undoMove";
import containerMove from "./planning/containerMove";

import battlePieceClick from "./battles/battlePieceClick";
import targetPieceClick from "./battles/targetPieceClick";
import enemyBattlePieceClick from "./battles/enemyBattlePieceClick";
import confirmBattleSelections from "./battles/confirmBattleSelections";
import clearOldBattle from "./battles/clearOldBattle";

import confirmFuelSelections from "./refuel/confirmFuelSelections";
import aircraftClick from "./refuel/aircraftClick";
import tankerClick from "./refuel/tankerClick";
import undoFuelSelection from "./refuel/undoFuelSelection";

import selectPosition from "./selectPosition";
import selectPiece from "./selectPiece";
import menuSelect from "./menuSelect";

import mainButtonClick from "./mainButtonClick";
import invItemClick from "./invItemClick";
import clearPieceSelection from "./clearPieceSelection"; //eventually replaced with menuSelect(-1) or menuSelect(0)

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
	mainButtonClick,
	battlePieceClick,
	targetPieceClick,
	enemyBattlePieceClick,
	confirmBattleSelections,
	clearOldBattle,
	invItemClick,
	clearPieceSelection,
	containerMove,
	confirmFuelSelections,
	tankerClick,
	aircraftClick,
	undoFuelSelection
};
