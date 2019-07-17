exports.gameAdd = (section, instructor, password) => {
    //validate the sender (session = course director)

    //validate the data

    //insert the game (make sure not already inserted)

    //return the success or fail (or game data back to the client to show on the table?)
    return true;
}

exports.gameDelete = (gameId) => {
    //validate the sender (session = course director)

    //validate the gameId (does it exist)

    //delete the game

    //return the success or fail
    return true;
}

exports.generateDatabase = () => {
    //validate the sender (session = course director)

    //run the sql script to insert the tables (if they don't exist already)

    //return the success or fail
    return true;
}

exports.getGames = () => {
    //validate the sender (session = course director)

    //get all the games from the database (order by gameId)

    //format the games as JSON (array)

    //return the JSON (could be empty array)
    let games = [{gameId: 1, gameSection: 'm1a1', gameInstructor: 'adolph', gameActive: 1}, {gameId: 2, gameSection: 't3b2', gameInstructor: 'kaz', gameActive: 0}];
    return JSON.stringify(games);
}












