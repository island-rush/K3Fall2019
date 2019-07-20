const md5 = require('md5');



exports.gameAdd = (mysqlPool, req, callback) => {
    //validate the session
    //req.session

    //validate the inputs
    const {adminSection, adminInstructor, adminPassword} = req.body;
    const adminPasswordHashed = md5(adminPassword);
    
    //attempt to insert
    mysqlPool.query('INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)', [adminSection, adminInstructor, adminPasswordHashed], (error, results, fields) => {
        if (error) {
            //handle error
            console.log(error.code);
            callback(false);
        } else {
            callback(true);
        }
    });
}

exports.gameDelete = (mysqlPool, req, callback) => {
    //validate the session
    //req.session

    //validate inputs
    const {gameId} = req.body;

    //attempt to delete
    mysqlPool.query('DELETE FROM games WHERE gameId = ?', [gameId], (error, results, fields) => {
        if (error) {
            //handle error
            console.log(error.code);
            callback(false);
        } else {
            callback(true);
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
    //verify session is cd

    mysqlPool.query('SELECT * FROM games', (error, results, fields) => {
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
    });
}












exports.adminLoginVerify = (mysqlPool, req, callback) => {
    //validate empty session (must have empty session variables to log into a different admin?)
    //req.session

    const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
    const CourseDirectorPassword = process.env.CD_PASSWORD || "5f4dcc3b5aa765d61d8327deb882cf99";  //"password"

    //get the login info / validate the login info?
    const {adminSection, adminInstructor, adminPassword} = req.body;
    const adminPasswordHashed = md5(adminPassword);

    //see if its the course director
    if (adminSection == "CourseDirector" && adminInstructor == CourseDirectorLastName && adminPasswordHashed == CourseDirectorPassword) {
        //set the session
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
        
        //authenticate the session
        //req.session
        callback(`/teacher.html?section=${adminSection}&instructor=${adminInstructor}`);
        return;
    });




}























