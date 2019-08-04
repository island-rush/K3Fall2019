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
