const md5 = require('md5');
const fs = require('fs');

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
    mysqlPool.query('UPDATE games SET gameActive = (gameActive + 1) % 2, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0 WHERE gameId = ?', [gameId], (error, result, fields) => {
        //handle error
        callback();
        return;
    });
}

exports.insertDatabaseTables = (mysqlPool, req, callback) => {
    const sql = fs.readFileSync('./server/sql/k3_tableInsert.sql').toString();
    mysqlPool.query(sql, (error, results, fields) => {
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

exports.gameLoginVerify = (mysqlPool, req, callback) => {
    const {gameSection, gameInstructor, gameTeam, gameTeamPassword, gameController} = req.body;
    if (!gameSection || !gameInstructor || !gameTeam || !gameTeamPassword || !gameController) {
        callback("/index.html?error=badRequest");
        return;
    }

    const gameTeamPasswordHashed = md5(gameTeamPassword);
    const commanderLoginField = 'game' + gameTeam + 'Controller' + gameController;  //ex: 'game0Controller0'
    mysqlPool.query('SELECT gameId, game0Password, game1Password, gameActive, ?? as commanderLogin FROM games WHERE gameSection = ? AND gameInstructor = ? ORDER BY gameId', [commanderLoginField, gameSection, gameInstructor], (error, results, fields) => {
        if (results.length != 1) {
            callback('/index.html?error=login');
            return;
        }

        const {gameId, game0Password, game1Password, gameActive, commanderLogin} = results[0];
        if (gameActive != 1) {
            callback('/index.html?error=gameNotActive');
            return;
        }
        if (commanderLogin != 0) {
            callback('/index.html?error=alreadyLoggedIn');
            return;
        }
        let gamePassword = game0Password;
        if (gameTeam == 1) {
            gamePassword = game1Password;
        }
        if (gameTeamPasswordHashed != gamePassword) {
            callback("/index.html?error=login");
            return;
        }

        mysqlPool.query('UPDATE games SET ?? = 1 WHERE gameId = ?', [commanderLoginField, gameId], (error, results, fields) => {
            //handle error
        });

        req.session.ir3 = {
            gameId: gameId,
            gameTeam: gameTeam,
            gameController: gameController
        }
        callback("/game.html");
        return;
    });
}
