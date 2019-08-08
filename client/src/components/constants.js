const relativePath = "./images/unitImages/";

export const typeImages = {
	//TypeId: ImageUrlCSS
	0: { backgroundImage: `url("${relativePath}radar.png")` },
	1: { backgroundImage: `url("${relativePath}stealthBomber.png")` },
	2: { backgroundImage: `url("${relativePath}submarine.png")` },
	3: { backgroundImage: `url("${relativePath}tank.png")` },
	4: { backgroundImage: `url("${relativePath}transport.png")` }
};

export const typeCosts = {
	//TypeId: Cost (points)
	0: 10, //radar
	1: 10, //plane
	2: 10, //sub
	3: 10, //tank
	4: 10 //transport
};

export const typeMoves = {
	//TypdId: Moves (-1 = warfare/non-piece)
	0: -1, //radar
	1: 5, //plane
	2: 5, //sub
	3: 5, //tank
	4: 5 //transport
};

export const typeNames = {
	0: "Radar",
	1: "Plane",
	2: "Sub",
	3: "Tank",
	4: "Transport"
};

//Could Use for reverse lookup / other constant ease of setup
export const typeNameIds = {
	Radar: 0,
	Plane: 1,
	Sub: 2,
	Tank: 3,
	Transport: 4
};

export const typeHighLow = {
	highPieces: [1],
	lowPieces: [0, 2, 3, 4]
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
