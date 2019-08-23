exports.INITIAL_GAMESTATE = "INITIAL_GAMESTATE";
exports.SHOP_PURCHASE = "SHOP_PURCHASE";
exports.SHOP_REFUND = "SHOP_REFUND";
exports.SET_USERFEEDBACK = "SET_USERFEEDBACK";
exports.SHOP_TRANSFER = "SHOP_TRANSFER";
exports.PLAN_WAS_CONFIRMED = "PLAN_WAS_CONFIRMED";
exports.DELETE_PLAN = "DELETE_PLAN";
exports.MAIN_BUTTON_CLICK = "MAIN_BUTTON_CLICK";
exports.PURCHASE_PHASE = "PURCHASE_PHASE";
exports.COMBAT_PHASE = "COMBAT_PHASE";
exports.PIECES_MOVE = "PIECES_MOVE";
exports.SLICE_CHANGE = "SLICE_CHANGE";
exports.PLACE_PHASE = "PLACE_PHASE";
exports.NEWS_PHASE = "NEWS_PHASE";
exports.NEW_ROUND = "NEW_ROUND";

exports.shopItemTypeCosts = {
	//TypeId: Cost
	0: 10, //radar
	1: 10, //plane
	2: 10, //sub
	3: 10, //tank
	4: 10 //transport
};

exports.typeMoves = {
	//TypdId: Moves (-1 = warfare)
	0: -1, //radar
	1: 5, //plane
	2: 5, //sub
	3: 5, //tank
	4: 5 //transport
};

exports.typeFuel = {
	//TypdId: Moves (-1 = warfare)
	0: -1, //radar
	1: 5, //plane
	2: -1, //sub
	3: -1, //tank
	4: -1 //transport
};

//this represents the typeIds that are 'containers' and can perform container moves for a plan, and other things
exports.containerTypes = [4];

exports.typeNames = {
	0: "Radar",
	1: "Plane",
	2: "Sub",
	3: "Tank",
	4: "Transport"
};

exports.typeNameIds = {
	"Radar": 0,
	"Plane": 1,
	"Sub": 2,
	"Tank": 3,
	"Transport": 4
};
