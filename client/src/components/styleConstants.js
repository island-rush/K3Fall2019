const relativePath = "./images/unitImages/";

//TODO: rename this file to something with better description of contents...not constants, but images? / colors? / palette?
//TODO: Make these constants ALL CAPS to distinguish them as constants in the components...
export const typeImages = {
	//TypeId: ImageUrlCSS
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

export const diceImages = {
	//TODO: use actual dice images instead of unit images
	// 0 => no dice roll yet
	0: { backgroundImage: `url("${relativePath}bomber.png")` }, //impossible (used, but wouldn't get called...(prevented))
	1: { backgroundImage: `url("${relativePath}stealthBomber.png")` }, //impossible, but used for testing (force a loss)
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
	12: { backgroundImage: `url("${relativePath}sam.png")` }
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
