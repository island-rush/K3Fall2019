const md5 = require('md5');

exports.gameAdd = (mysqlPool, req, callback) => {
    const {adminSection, adminInstructor, adminPassword} = req.body;
    if (!adminSection || !adminInstructor || !adminPassword) {
        callback(false);
        return;
    }

    const adminPasswordHashed = md5(adminPassword);
    mysqlPool.query('INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)', [adminSection, adminInstructor, adminPasswordHashed], (error, results, fields) => {
        if (error) {
            callback(false);
            return;
        } else {
            callback(true);
            return;
        }
    });
}

exports.gameDelete = (mysqlPool, req, callback) => {
    const {gameId} = req.body;
    if (!gameId) {
        callback(false);
        return;
    }

    mysqlPool.query('DELETE FROM games WHERE gameId = ?', [gameId], (error, results, fields) => {
        if (error) {
            callback(false);
            return;
        } else {
            callback(true);
            return;
        }
    });
}

exports.databaseStatus = (mysqlPool, req, callback) => {
    mysqlPool.getConnection((err, connection) => {
        if (err) {
            callback(false);
        } else {
            callback(true);
            connection.release();
        }
    });
}

exports.getGames = (mysqlPool, req, callback) => {
    mysqlPool.query('SELECT * FROM games', (error, results, fields) => {
        if (error) {
            callback(JSON.stringify([]));
            return;
        }
        let games = [];
        for (let x = 0; x < results.length; x++) {
            games.push({
                gameId: results[x].gameId,
                gameSection: results[x].gameSection,
                gameInstructor: results[x].gameInstructor,
                gameActive: results[x].gameActive
            });
        }
        callback(JSON.stringify(games));
        return;
    });
}

exports.adminLoginVerify = (mysqlPool, req, callback) => {
    const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
    const CourseDirectorPassword = process.env.CD_PASSWORD || "5f4dcc3b5aa765d61d8327deb882cf99";  //"password"
    const {adminSection, adminInstructor, adminPassword} = req.body;
    if (!adminSection || !adminInstructor || !adminPassword) {
        callback("/index.html?error=badRequest");
        return;
    }

    const adminPasswordHashed = md5(adminPassword);
    if (adminSection == "CourseDirector" && adminInstructor == CourseDirectorLastName && adminPasswordHashed == CourseDirectorPassword) {
        req.session.ir3 = {courseDirector: true};
        callback("/courseDirector.html");
        return;
    }

    mysqlPool.query('SELECT gameId, gameAdminPassword FROM games WHERE gameSection = ? AND gameInstructor = ? ORDER BY gameId', [adminSection, adminInstructor], (error, results, fields) => {
        if (results.length != 1) {
            callback('/index.html?error=login');
            return;
        }

        const {gameId, gameAdminPassword} = results[0];
        if (gameAdminPassword != adminPasswordHashed) {
            callback('/index.html?error=login');
            return;
        }
        
        req.session.ir3 = {
            gameId: gameId,
            teacher: true
        }
        callback(`/teacher.html?section=${adminSection}&instructor=${adminInstructor}`);
        return;
    });
}

exports.getGameActive = (mysqlPool, req, callback) => {
    const {gameId} = req.session.ir3;
    mysqlPool.query('SELECT gameActive FROM games WHERE gameId = ?', [gameId], (error, results, fields) => {
        callback(results[0].gameActive);
        return;
    });
}

exports.toggleGameActive = (mysqlPool, req, callback) => {
    const {gameId} = req.session.ir3;
    mysqlPool.query('UPDATE games SET gameActive = (gameActive + 1) % 2 WHERE gameId = ?', [gameId], (error, result, fields) => {
        callback();
        return;
    });
}

exports.insertDatabaseTables = (mysqlPool, req, callback) => {
    mysqlPool.query('CREATE TABLE IF NOT EXISTS games(gameId INT(2) NOT NULL UNIQUE AUTO_INCREMENT, gameSection VARCHAR(4) NOT NULL, gameInstructor VARCHAR(32) NOT NULL, gameAdminPassword VARCHAR(32) NOT NULL, gameActive INT(1) NOT NULL DEFAULT 0, PRIMARY KEY(gameId)) AUTO_INCREMENT=1', (error, results, fields) => {
        if (error) {
            console.log(error);
            callback("failed");
            return;
        } else {
            callback("success");
            return;
        }
    });
}
