//these are the same as the redux/actions/types (NEED TO BE THE SAME)
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
	0: 5, //bomer
	1: 5, //stealth bomber
	2: 5, //stealth fighter
	3: 5,
	4: 5,
	5: 5,
	6: 5,
	7: 5,
	8: 5,
	9: 5,
	10: 5,
	11: 5,
	12: 5,
	13: 5,
	14: 5,
	15: 5,
	16: 5,
	17: 5,
	18: 5,
	19: 5
};

exports.typeMoves = {
	//TypdId: Moves
	0: 5, //bomer
	1: 5, //stealth bomber
	2: 5, //stealth fighter
	3: 5,
	4: 5,
	5: 5,
	6: 5,
	7: 5,
	8: 5,
	9: 5,
	10: 5,
	11: 5,
	12: 5,
	13: 5,
	14: 5,
	15: 5,
	16: 5,
	17: 5,
	18: 5,
	19: 5
};

exports.typeFuel = {
	//TypdId: Moves (-1 = warfare)
	0: 5, //bomer
	1: 5, //stealth bomber
	2: 5, //stealth fighter
	3: 5,
	4: 5,
	5: 5,
	6: 5,
	7: 5,
	8: 5,
	9: 5,
	10: 5,
	11: 5,
	12: 5,
	13: 5,
	14: 5,
	15: 5,
	16: 5,
	17: 5,
	18: 5,
	19: 5
};

//this represents the typeIds that are 'containers' and can perform container moves for a plan, and other things
exports.containerTypes = [4, 14, 16, 18];

exports.typeNames = {
	0: "Bomber",
	1: "Stealth Bomber",
	2: "Stealth Fighter",
	3: "Tanker",
	4: "Air Transport",
	5: "Air ISR",
	6: "Army Infantry",
	7: "Artillery",
	8: "Tank",
	9: "Marine Infantry",
	10: "Attack Helicopter",
	11: "LAV",
	12: "SAM",
	13: "Destroyer",
	14: "A.C. Carrier",
	15: "Submarine",
	16: "Transport",
	17: "MC-12",
	18: "C-130",
	19: "SOF Team"
};

exports.typeNameIds = {
	"Bomber": 0,
	"Stealth Bomber": 1,
	"Stealth Fighter": 2,
	"Tanker": 3,
	"Air Transport": 4,
	"Air ISR": 5,
	"Army Infantry": 6,
	"Artillery": 7,
	"Tank": 8,
	"Marine Infantry": 9,
	"Attack Helicopter": 10,
	"LAV": 11,
	"SAM": 12,
	"Destroyer": 13,
	"A.C. Carrier": 14,
	"Submarine": 15,
	"Transport": 16,
	"MC-12": 17,
	"C-130": 18,
	"SOF Team": 19
};

//TODO: use the updated units excel at https://docs.google.com/spreadsheets/d/1kiMLv05oK6IZKtiYdErvD4Kp5tI3lXLL2-qbO3ZqHAI/edit#gid=306372336
exports.visibilityMatrix = [
	[1, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1], //bomber
	[0, -1, -1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1], //stealth bomber
	[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0], //stealth fighter
	[0, -1, -1, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, 0], //tanker
	[0, -1, -1, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, 0], //air transport
	[-1, -1, -1, -1, -1, -1, 2, 2, 2, 2, 2, 2, 2, 1, 1, -1, 1], //air isr
	[-1, -1, -1, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //infantry (army)
	[-1, -1, -1, -1, 0, -1, 1, 1, 1, 1, 1, 1, 1, 0, 0, -1, 0], //artillery
	[-1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //tank
	[-1, -1, -1, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //infantry (marine)
	[-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 0, 1, 0, 0, 0, -1, 0], //attack helicopter
	[-1, -1, -1, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //LAV
	[2, 0, 0, 2, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0], //SAM
	[0, -1, -1, 0, 0, 0, -1, -1, -1, -1, 0, -1, -1, 1, 1, 0, 1], //destroyer
	[0, -1, -1, 0, 0, 0, -1, -1, -1, -1, 0, -1, -1, 1, 1, -1, 1], //a.c. carrier
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, 0, 0, 0, 0], //submarine
	[0, -1, -1, 0, 0, 0, -1, -1, -1, -1, 0, -1, -1, 0, 0, -1, 0], //transport
	[-1, -1, -1, -1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, -1, 0], //mc-12
	[0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0], //c-130
	[-1, -1, -1, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0] //sof team
];

exports.attackMatrix = [
	[0, 0, 0, 0, 0, 0, 4, 5, 3, 4, 0, 3, 2, 3, 2, 1, 3, 0, 0, 2], //bomber
	[0, 0, 0, 0, 0, 0, 3, 5, 3, 4, 0, 3, 3, 3, 2, 1, 3, 0, 0, 2], //stealth bomber
	[5, 4, 3, 5, 5, 5, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0], //stealth fighter
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //tanker
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //air transport
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //air isr
	[0, 0, 0, 0, 1, 1, 4, 5, 2, 3, 2, 3, 5, 0, 0, 0, 0, 0, 0, 4], //infantry (army)
	[0, 0, 0, 0, 0, 0, 4, 4, 3, 4, 1, 4, 5, 0, 0, 0, 0, 0, 0, 3], //artillery
	[0, 0, 0, 0, 0, 0, 4, 5, 3, 4, 2, 3, 5, 0, 0, 0, 0, 0, 0, 4], //tank
	[0, 0, 0, 0, 1, 1, 4, 5, 2, 3, 2, 3, 5, 0, 0, 0, 0, 0, 0, 4], //infantry (marine)
	[0, 0, 0, 0, 3, 2, 3, 4, 2, 3, 2, 3, 1, 0, 0, 0, 0, 0, 0, 5], //attack helicopter
	[0, 0, 0, 0, 2, 0, 4, 5, 2, 3, 1, 3, 5, 0, 0, 0, 0, 0, 0, 4], //LAV
	[5, 4, 3, 5, 5, 5, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0], //SAM
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 0, 5, 3, 3, 0], //destroyer
	[3, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 3, 3, 0], //a.c. carrier
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 2, 5, 0, 0, 0], //submarine
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //transport
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //mc-12
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //c-130
	[0, 0, 0, 0, 0, 0, 2, 5, 1, 2, 1, 2, 5, 0, 0, 0, 0, 0, 0, 0] //sof team
];
