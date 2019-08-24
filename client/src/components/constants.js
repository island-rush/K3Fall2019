const relativePath = "./images/unitImages/";

export const typeImages = {
	//TypeId: ImageUrlCSS
	//TODO: fix these links for all units
	0: { backgroundImage: `url("${relativePath}bomber.png")` },
	1: { backgroundImage: `url("${relativePath}stealthBomber.png")` },
	2: { backgroundImage: `url("${relativePath}fighter.png")` },
	3: { backgroundImage: `url("${relativePath}tanker.png")` },
	4: { backgroundImage: `url("${relativePath}c17.png")` },
	5: { backgroundImage: `url("${relativePath}e3.png")` },
	6: { backgroundImage: `url("${relativePath}infantry.png")` },
	7: { backgroundImage: `url("${relativePath}artillery.png")` },
	8: { backgroundImage: `url("${relativePath}tank.png")` },
	9: { backgroundImage: `url("${relativePath}marine.png")` },
	10: { backgroundImage: `url("${relativePath}attackHeli.png")` },
	11: { backgroundImage: `url("${relativePath}convoy.png")` },
	12: { backgroundImage: `url("${relativePath}sam.png")` },
	13: { backgroundImage: `url("${relativePath}destroyer.png")` },
	14: { backgroundImage: `url("${relativePath}aircraftCarrier.png")` },
	15: { backgroundImage: `url("${relativePath}submarine.png")` },
	16: { backgroundImage: `url("${relativePath}transport.png")` },
	17: { backgroundImage: `url("${relativePath}mc12.png")` },
	18: { backgroundImage: `url("${relativePath}c130.png")` },
	19: { backgroundImage: `url("${relativePath}sofTeam.png")` }
};

export const typeCosts = {
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

export const typeMoves = {
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

export const typeFuel = {
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

export const typeNames = {
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

//Could Use for reverse lookup / other constant ease of setup
export const typeNameIds = {
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

export const typeHighLow = {
	highPieces: [0, 1, 2, 3, 4, 5, 10, 17, 18],
	lowPieces: [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 19]
};

export const zoomboxBackgrounds = {
	land: { backgroundColor: "green" },
	water: { backgroundColor: "cyan" },
	airfield: { backgroundColor: "green" },
	flag: { backgroundColor: "green" },
	missile: { backgroundColor: "green" },
	red: { backgroundColor: "green" },
	blue: { backgroundColor: "green" }
};

export const typeTeamBorders = {
	0: { boxShadow: "0px 0px 0px 2px rgba(0, 111, 255, 0.67) inset" }, //blue
	1: { boxShadow: "0px 0px 0px 2px rgba(255, 0, 0, 0.55) inset" } //red
};
