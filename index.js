// ----------------------------------------------------------------------------------------
// Server Setup and Configuration
// ----------------------------------------------------------------------------------------

const port = process.env.PORT || 80;
const DatabaseHostname = process.env.DB_HOSTNAME || "localhost";
const DatabaseUsername = process.env.DB_USERNAME || "root";
const DatabasePassword = process.env.DB_PASSWORD || "";
const DatabaseName = process.env.DB_NAME || "k3";
const backendServices = require('./server/backendServices.js');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session')({
    secret: process.env.SESSION_SECRET || "sdlkjslfjk",
    resave: true,
    saveUninitialized: true
});
const sharedsession = require('express-socket.io-session');
app.use(session);
app.use(express.urlencoded());
io.use(sharedsession(session));

const mysql = require('mysql');
const databaseConfig = {
    connectionLimit: 10,
    host: DatabaseHostname,
    user: DatabaseUsername,
    password: DatabasePassword,
    database: DatabaseName
}
let mysqlPool = mysql.createPool(databaseConfig);

const csvparse = require('csv-array');
let distanceMatrix = [];
csvparse.parseCSV('./server/distanceMatrix.csv', (data) => { distanceMatrix = data; }, false);



// ----------------------------------------------------------------------------------------
// Internal Routing (unrestricted access)
// ----------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    delete req.session.ir3;
    res.sendFile(__dirname + '/server/routes/index.html');
});

app.get('/index.html', (req, res) => {
    delete req.session.ir3;
    res.sendFile(__dirname + '/server/routes/index.html');
});

app.get('/troubleshoot.html', (req, res) => {
    res.sendFile(__dirname + '/server/routes/troubleshoot.html');
});

app.get('/credits.html', (req, res) => {
    res.sendFile(__dirname + '/server/routes/credits.html');
});

app.get('/databaseStatus', (req, res) => {
    backendServices.databaseStatus(mysqlPool, req, (result) => {
        res.send(result ? "Success" : "Failed");
    });
});

// ----------------------------------------------------------------------------------------
// Teacher and Course Director Services / Routing
// ----------------------------------------------------------------------------------------

app.get('/teacher.html', (req, res) => {
    if (req.session.ir3 && req.session.ir3.teacher) {
        res.sendFile(__dirname + '/server/routes/teacher.html');
    } else {
        res.redirect('/index.html?error=login');
    }
});

app.get('/courseDirector.html', (req, res) => {
    if (req.session.ir3 && req.session.ir3.courseDirector) {
        res.sendFile(__dirname + '/server/routes/courseDirector.html');
    } else {
        res.redirect('/index.html?error=login');
    }
});

app.post('/adminLoginVerify', (req, res) => {
    backendServices.adminLoginVerify(mysqlPool, req, (result) => {
        res.redirect(result);
    });
});

app.post('/gameAdd', (req, res) => {
    if (req.session.ir3 && req.session.ir3.courseDirector) {
        backendServices.gameAdd(mysqlPool, req, (result) => {
            res.redirect(`/courseDirector.html?gameAdd=${result ? "success" : "failed"}`);
        });
    } else {
        res.redirect('/index.html?error=access');
    }
});

app.post('/gameDelete', (req, res) => {
    if (req.session.ir3 && req.session.ir3.courseDirector) {
        backendServices.gameDelete(mysqlPool, req, (result) => {
            res.redirect(`/courseDirector.html?gameDelete=${result ? "success" : "failed"}`);
        });
    } else {
        res.redirect('/index.html?error=access');
    }
});

app.post('/insertDatabaseTables', (req, res) => {
    if (req.session.ir3 && req.session.ir3.courseDirector) {
        backendServices.insertDatabaseTables(mysqlPool, req, (result) => {
            res.redirect(`/courseDirector.html?initializeDatabase=${result}`);
        });
    } else {
        res.redirect('/index.html?error=access');
    }
});

app.get('/getGames', (req, res) => {
    if (req.session.ir3 && (req.session.ir3.teacher || req.session.ir3.courseDirector)) {
        backendServices.getGames(mysqlPool, req, (result) => {
            res.send(result);
        });
    } else {
        res.redirect('/index.html?error=access');
    }
});

app.get('/getGameActive', (req, res) => {
    if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
        backendServices.getGameActive(mysqlPool, req, (result) => {
            res.send(JSON.stringify(result));
        });
    } else {
        res.redirect('/index.html?error=access');
    }
});

app.post('/toggleGameActive', (req, res) => {
    if (req.session.ir3 && req.session.ir3.teacher && req.session.ir3.gameId) {
        backendServices.toggleGameActive(mysqlPool, req, (result) => {});
    } else {
        res.redirect('/index.html?error=access');
    }
});

// ----------------------------------------------------------------------------------------
// Game Routing (into the react app)
// ----------------------------------------------------------------------------------------

app.post('/gameLoginVerify', (req, res) => {
    backendServices.gameLoginVerify(mysqlPool, req, (result) => {
        res.redirect(result);
    });
});

app.get('/game.html', (req, res) => {
    if (req.session.ir3 && req.session.ir3.gameId && req.session.ir3.gameTeam && req.session.ir3.gameController) {
        res.sendFile(__dirname + '/client/build/index.html');
        // res.redirect('http://localhost:3000');
    } else {
        res.redirect('/index.html?error=login');
    }
});

app.use(express.static(__dirname + '/client/build'));

// ----------------------------------------------------------------------------------------
// Socket Requests (client + server gameplay services)
// ----------------------------------------------------------------------------------------

io.sockets.on('connection', (socket) => {
    //add the socket to a game 'room' to speak to it later
    socket.join('game' + socket.handshake.session.ir3.gameId + 'team' + socket.handshake.session.ir3.teamId);
    console.log("socket connected");
    //give the client game state info

    // //get game state info
    // mysqlPool.query("SELECT * FROM games WHERE gameId = ?", [socket.handshake.session.ir3.gameId], (error, results, fields) => {
    //     //handle error
    //     socket.emit('gameState', {
    //         gameSection: results[0].gameSection,
    //         gameInstructor: results[0].gameInstructor
    //     });
    // });

    socket.on('disconnect', () => {
        const controllerLoginField = 'game' + socket.handshake.session.ir3.gameTeam + 'Controller' + socket.handshake.session.ir3.gameController;
        const gameId = socket.handshake.session.ir3.gameId;
        mysqlPool.query('UPDATE games SET ?? = 0 WHERE gameId = ?', [controllerLoginField, gameId], (error, results, fields) => {
            //handle error 
        });
        console.log("socket disconnected");
    });
    socket.on('callToServer', (callback) => {
        callback("only the server knows this info");
    });
});

// ----------------------------------------------------------------------------------------
// Start taking in requests to the server
// ----------------------------------------------------------------------------------------

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
