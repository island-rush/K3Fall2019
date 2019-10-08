const unitImagesPath = "./images/unitImages";
// const diceImagesPath = "./images/diceImages";
// const graphicsPath = "./images/graphics";
const buttonImagesPath = "./images/buttonImages";

export const TYPE_IMAGES = {
	//TypeId: ImageUrlCSS
	0: { backgroundImage: `url("${unitImagesPath}/bomber.png")` },
	1: { backgroundImage: `url("${unitImagesPath}/stealthBomber.png")` },
	2: { backgroundImage: `url("${unitImagesPath}/fighter.png")` },
	3: { backgroundImage: `url("${unitImagesPath}/tanker.png")` },
	4: { backgroundImage: `url("${unitImagesPath}/c17.png")` },
	5: { backgroundImage: `url("${unitImagesPath}/e3.png")` },
	6: { backgroundImage: `url("${unitImagesPath}/infantry.png")` },
	7: { backgroundImage: `url("${unitImagesPath}/artillery.png")` },
	8: { backgroundImage: `url("${unitImagesPath}/tank.png")` },
	9: { backgroundImage: `url("${unitImagesPath}/marine.png")` },
	10: { backgroundImage: `url("${unitImagesPath}/attackHeli.png")` },
	11: { backgroundImage: `url("${unitImagesPath}/convoy.png")` },
	12: { backgroundImage: `url("${unitImagesPath}/sam.png")` },
	13: { backgroundImage: `url("${unitImagesPath}/destroyer.png")` },
	14: { backgroundImage: `url("${unitImagesPath}/aircraftCarrier.png")` },
	15: { backgroundImage: `url("${unitImagesPath}/submarine.png")` },
	16: { backgroundImage: `url("${unitImagesPath}/transport.png")` },
	17: { backgroundImage: `url("${unitImagesPath}/mc12.png")` },
	18: { backgroundImage: `url("${unitImagesPath}/c130.png")` },
	19: { backgroundImage: `url("${unitImagesPath}/sofTeam.png")` }
};

export const DICE_IMAGES = {
	//TODO: use actual dice images instead of unit images
	// 0 => no dice roll yet
	0: { backgroundImage: `url("${unitImagesPath}/bomber.png")` }, //impossible (used, but wouldn't get called...(prevented))
	1: { backgroundImage: `url("${unitImagesPath}/stealthBomber.png")` }, //impossible, but used for testing (force a loss)
	2: { backgroundImage: `url("${unitImagesPath}/fighter.png")` },
	3: { backgroundImage: `url("${unitImagesPath}/tanker.png")` },
	4: { backgroundImage: `url("${unitImagesPath}/c17.png")` },
	5: { backgroundImage: `url("${unitImagesPath}/e3.png")` },
	6: { backgroundImage: `url("${unitImagesPath}/infantry.png")` },
	7: { backgroundImage: `url("${unitImagesPath}/artillery.png")` },
	8: { backgroundImage: `url("${unitImagesPath}/tank.png")` },
	9: { backgroundImage: `url("${unitImagesPath}/marine.png")` },
	10: { backgroundImage: `url("${unitImagesPath}/attackHeli.png")` },
	11: { backgroundImage: `url("${unitImagesPath}/convoy.png")` },
	12: { backgroundImage: `url("${unitImagesPath}/sam.png")` }
};

export const LEFT_CONTROLS_IMAGES = {
	start: { backgroundImage: `url("${buttonImagesPath}/iconPlanning.png")` },
	undo: { backgroundImage: `url("${buttonImagesPath}/iconUndo.png")` },
	cancel: { backgroundImage: `url("${buttonImagesPath}/iconCancel.png")` },
	confirm: { backgroundImage: `url("${buttonImagesPath}/iconConfirm.png")` },
	container: {
		backgroundImage: `url("${buttonImagesPath}/iconContainer.png")`
	}
};

export const ZOOMBOX_BACKGROUNDS = {
	land: { backgroundColor: "green" },
	water: { backgroundColor: "cyan" },
	airfield: { backgroundColor: "green" },
	flag: { backgroundColor: "green" },
	missile: { backgroundColor: "green" },
	red: { backgroundColor: "green" },
	blue: { backgroundColor: "green" }
};

export const TYPE_TEAM_BORDERS = {
	0: { boxShadow: "0px 0px 0px 2px rgba(0, 111, 255, 0.67) inset" }, //blue
	1: { boxShadow: "0px 0px 0px 2px rgba(255, 0, 0, 0.55) inset" } //red
};
