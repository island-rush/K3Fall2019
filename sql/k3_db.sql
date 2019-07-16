-- FIGURING OUT THE DATABASE IN THIS FILE --
-- REMOVE AFTER PRODUCTION IS READY --

DROP DATABASE IF EXISTS k3;
CREATE DATABASE k3;
USE k3;
SET SQL_SAFE_UPDATES = 0;

CREATE TABLE IF NOT EXISTS games(
	gameId INT(2) NOT NULL UNIQUE AUTO_INCREMENT,
	gameSection VARCHAR(4) NOT NULL,  -- ex: "M1A1"
	gameInstructor VARCHAR(32) NOT NULL,  -- ex: "Adolph"
	gameAdminPassword VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',  -- md5('password') is the default, use md5 for all hashes
    game0Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
    game1Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',

	gameActive INT(1) NOT NULL DEFAULT 0,  -- 0: inactive, 1: active (set by the admin)

	game0Controller0 INT(1) NOT NULL DEFAULT 0,  -- 0: logged out, 1: logged in
    game0Controller1 INT(1) NOT NULL DEFAULT 0,
    game0Controller2 INT(1) NOT NULL DEFAULT 0,
    game0Controller3 INT(1) NOT NULL DEFAULT 0,
	game1Controller0 INT(1) NOT NULL DEFAULT 0,
    game1Controller1 INT(1) NOT NULL DEFAULT 0,
    game1Controller2 INT(1) NOT NULL DEFAULT 0,
    game1Controller3 INT(1) NOT NULL DEFAULT 0,
    
    game0Status INT(1) NOT NULL DEFAULT 0,  -- 0: still active, 1: waiting for other player
	game1Status INT(1) NOT NULL DEFAULT 0,
    
    game0Points INT(4) NOT NULL DEFAULT 10,
	game1Points INT(4) NOT NULL DEFAULT 20,

	gamePhase INT(1) NOT NULL DEFAULT 3, -- 0: news, 1: buy, 2: gameplay, 3: place inv
    gameRound INT(1) NOT NULL DEFAULT 0, -- 0, 1, 2  rounds of movement
    gameSlice INT(1) NOT NULL DEFAULT 0, -- 0: planning, 1: battle/movement, 2: refuel, 3: containers

    gameFlag0 INT(1) NOT NULL DEFAULT 1, 
    gameFlag1 INT(1) NOT NULL DEFAULT 1,
    gameFlag2 INT(1) NOT NULL DEFAULT 1,
    gameFlag3 INT(1) NOT NULL DEFAULT 1, -- 0: red, 1: blue, (2 = neutral?, 3 = nuke?...etc)
    gameFlag4 INT(1) NOT NULL DEFAULT 1,
    gameFlag5 INT(1) NOT NULL DEFAULT 1,
    gameFlag6 INT(1) NOT NULL DEFAULT 1,
    gameFlag7 INT(1) NOT NULL DEFAULT 1,
    gameFlag8 INT(1) NOT NULL DEFAULT 1,
    gameFlag9 INT(1) NOT NULL DEFAULT 1,
    gameFlag10 INT(1) NOT NULL DEFAULT 1,
    gameFlag11 INT(1) NOT NULL DEFAULT 1,
    gameAirfield0 INT(1) NOT NULL DEFAULT 1,
    gameAirfield1 INT(1) NOT NULL DEFAULT 1,
    gameAirfield2 INT(1) NOT NULL DEFAULT 1,
    gameAirfield3 INT(1) NOT NULL DEFAULT 1,
    gameAirfield4 INT(1) NOT NULL DEFAULT 1,
    gameAirfield5 INT(1) NOT NULL DEFAULT 1,
	PRIMARY KEY(gameId)
) AUTO_INCREMENT=1;