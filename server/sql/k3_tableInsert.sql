CREATE TABLE IF NOT EXISTS games(
	gameId INT(2) NOT NULL UNIQUE AUTO_INCREMENT,
	gameSection VARCHAR(4) NOT NULL,
	gameInstructor VARCHAR(32) NOT NULL,
	gameAdminPassword VARCHAR(32) NOT NULL,
	gameActive INT(1) NOT NULL DEFAULT 0,
	game0Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
	game1Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
	game0Controller0 INT(1) NOT NULL DEFAULT 0,  -- 0: logged out, 1: logged in
    game0Controller1 INT(1) NOT NULL DEFAULT 0,  -- 0 = main controller
    game0Controller2 INT(1) NOT NULL DEFAULT 0,
    game0Controller3 INT(1) NOT NULL DEFAULT 0,
	game1Controller0 INT(1) NOT NULL DEFAULT 0,
    game1Controller1 INT(1) NOT NULL DEFAULT 0,
    game1Controller2 INT(1) NOT NULL DEFAULT 0,
    game1Controller3 INT(1) NOT NULL DEFAULT 0,
	PRIMARY KEY(gameId)
) AUTO_INCREMENT=1;