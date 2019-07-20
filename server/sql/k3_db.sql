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
	gameAdminPassword VARCHAR(32) NOT NULL, -- md5('password') is the default, use md5 for all hashes
	gameActive INT(1) NOT NULL DEFAULT 0,  -- 0: inactive, 1: active (set by the admin)
	PRIMARY KEY(gameId)
) AUTO_INCREMENT=1;

SELECT * FROM games;