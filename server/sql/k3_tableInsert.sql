-- -----------------------------------------------------------------------
-- DATABASE CREATION --
-- -----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS games(
	gameId INT(2) NOT NULL UNIQUE AUTO_INCREMENT,
	gameSection VARCHAR(4) NOT NULL,
	gameInstructor VARCHAR(32) NOT NULL,
	gameAdminPassword VARCHAR(32) NOT NULL,

	gameActive INT(1) NOT NULL DEFAULT 0,

	game0Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
	game1Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',

	PRIMARY KEY(gameId)
) AUTO_INCREMENT=1;


