CREATE TABLE IF NOT EXISTS games (
	gameId INT(3) PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
    gameSection VARCHAR(4) NOT NULL,
    gameInstructor VARCHAR(32) NOT NULL,
    
    gameAdminPassword VARCHAR(32) NOT NULL,
    gameActive INT(1) NOT NULL DEFAULT 0,
    
    game0Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
    game1Password VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
    
    game0Controller0 INT(1) NOT NULL DEFAULT 0,
    game0Controller1 INT(1) NOT NULL DEFAULT 0,
    game0Controller2 INT(1) NOT NULL DEFAULT 0,
    game0Controller3 INT(1) NOT NULL DEFAULT 0,
    game1Controller0 INT(1) NOT NULL DEFAULT 0,
    game1Controller1 INT(1) NOT NULL DEFAULT 0,
    game1Controller2 INT(1) NOT NULL DEFAULT 0,
    game1Controller3 INT(1) NOT NULL DEFAULT 0,
    
	game0Status INT(1) NOT NULL DEFAULT 0,  -- 0: still active, 1: waiting for other player
	game1Status INT(1) NOT NULL DEFAULT 0,
    
    game0Points INT(5) NOT NULL DEFAULT 50,
    game1Points INT(5) NOT NULL DEFAULT 50,
    
    gamePhase INT(1) NOT NULL DEFAULT 0, -- 0: news, 1: buy, 2: gameplay, 3: place inv
    gameRound INT(1) NOT NULL DEFAULT 0, -- 0, 1, 2  rounds of movement
    gameSlice INT(1) NOT NULL DEFAULT 0 -- 0: planning, 1: battle/movement, 2: refuel, 3: containers
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS shopItems (
    shopItemId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    shopItemGameId INT(3) NOT NULL,
    shopItemTeamId INT(1) NOT NULL,
    shopItemTypeId INT(2) NOT NULL,
    FOREIGN KEY (shopItemGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS invItems (
    invItemId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    invItemGameId INT(3) NOT NULL,
    invItemTeamId INT(1) NOT NULL,
    invItemTypeId INT(2) NOT NULL,
    FOREIGN KEY (invItemGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS pieces (
	pieceId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    pieceGameId INT(3) NOT NULL,
    pieceTeamId INT(1) NOT NULL,
    pieceTypeId INT(2) NOT NULL,
    piecePositionId INT(4) NOT NULL,
    pieceContainerId INT(8) NOT NULL,
    pieceVisible INT(1) NOT NULL,
    pieceMoves INT(2) NOT NULL,
    pieceFuel INT(2) NOT NULL,
    FOREIGN KEY (pieceGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS plans(
    planGameId INT(2) NOT NULL,
    planTeamId INT(1) NOT NULL,
    planPieceId INT(8) NOT NULL,
    planMovementOrder INT(2) NOT NULL,
    planPositionId INT(4) NOT NULL,
    planSpecialFlag INT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (planGameId) REFERENCES games (gameId) ON DELETE CASCADE,
    FOREIGN KEY (planPieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    PRIMARY KEY (planPieceId, planMovementOrder)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS news(
	newsId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    newsGameId INT(4) NOT NULL,
    newsTeam INT(4) NOT NULL,
    newsOrder INT(4) NOT NULL,
    newsPieces INT(4) NOT NULL,
    newsEffect INT(4) NOT NULL,
    newsRoll INT(4) NOT NULL,
    newsLength INT(4) NOT NULL,
    newsZone INT(4) NOT NULL,
    newsTitle VARCHAR(100) NOT NULL,
    newsInfo VARCHAR(800) NOT NULL,
    newsActivated INT(1) NOT NULL,
    FOREIGN KEY (newsGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS eventQueue(
	eventId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    eventGameId INT(4) NOT NULL,
    eventTeamId INT(1) NOT NULL, -- 0,1 or 2 for both
    eventTypeId INT(2) NOT NULL, -- 0 = battle, 1 = container, 2 = refuel
    eventPosA INT(4) NOT NULL DEFAULT -1,
    eventPosB INT(4) NOT NULL DEFAULT -1,
    FOREIGN KEY (eventGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS eventItems(
	eventId INT(8) NOT NULL,
    eventPieceId INT(8) NOT NULL,
    FOREIGN KEY (eventId) REFERENCES eventQueue (eventId) ON DELETE CASCADE,
    FOREIGN KEY (eventPieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    PRIMARY KEY (eventId, eventPieceId)
);

CREATE TABLE IF NOT EXISTS eventItemsTemp(
    eventPieceId INT(8) PRIMARY KEY NOT NULL,
    eventItemGameId INT(4) NOT NULL,
    eventPosA INT(4) NOT NULL DEFAULT -1,
    eventPosB INT(4) NOT NULL DEFAULT -1,
    FOREIGN KEY (eventPieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (eventItemGameId) REFERENCES games (gameId) ON DELETE CASCADE
);
