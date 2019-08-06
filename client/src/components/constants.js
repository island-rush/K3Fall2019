export const typeImages = {
	//TypeId: ImageUrlCSS
	0: { backgroundImage: 'url("./images/radar.png")' },
	1: { backgroundImage: 'url("./images/stealthBomber.png")' },
	2: { backgroundImage: 'url("./images/submarine.png")' },
	3: { backgroundImage: 'url("./images/tank.png")' }
};

export const typeCosts = {
	//TypeId: Cost (points)
	0: 10, //radar
	1: 10, //plane
	2: 10, //sub
	3: 10 //tank
};

export const typeMoves = {
	//TypdId: Moves (-1 = warfare)
	0: -1, //radar
	1: 5, //plane
	2: 5, //sub
	3: 5 //tank
};

export const typeNames = {
	0: "Radar",
	1: "Plane",
	2: "Sub",
	3: "Tank"
};

//Could Use for reverse lookup / other constant ease of setup
export const typeNameIds = {
	Radar: 0,
	Plane: 1,
	Sub: 2,
	Tank: 3
};

export const typeHighLow = {
	highPieces: [0, 1],
	lowPieces: [2, 3]
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
