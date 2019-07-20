exports.gameAdd = (mysqlPool, req, callback) => {
    //validate the session
    //req.session

    //validate the inputs
    const {adminSection, adminInstructor, adminPassword} = req.body;
    
    //attempt to insert
    mysqlPool.query('INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) VALUES (?, ?, ?)', [adminSection, adminInstructor, adminPassword], (error, results, fields) => {
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
    
}