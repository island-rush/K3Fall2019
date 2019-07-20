// ----------------------------------------------------------------------------------------
// Server Setup and Configuration
// ----------------------------------------------------------------------------------------

const port = process.env.PORT || 80;
const CourseDirectorLastName = process.env.CD_LASTNAME || "Smith";
const CourseDirectorPassword = process.env.CD_PASSWORD || "5f4dcc3b5aa765d61d8327deb882cf99";  //"password"
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
const md5 = require('md5');

// Dataase Connection Pool
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

app.use(express.static(__dirname + '/client/build'));

// ----------------------------------------------------------------------------------------
// Internal Routing (unrestricted access)
// ----------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.get('/index.html', (req, res) => {
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
    res.sendFile(__dirname + '/server/routes/teacher.html');
});

app.get('/courseDirector.html', (req, res) => {
    res.sendFile(__dirname + '/server/routes/courseDirector.html');
});

app.post('/gameAdd', (req, res) => {
    //TODO: Redirect to home page if not an authenticated course director / admin
    backendServices.gameAdd(mysqlPool, req, (result) => {
        res.redirect(`/courseDirector.html?gameAdd=${result ? "success" : "failed"}`);
    });
});

app.post('/gameDelete', (req, res) => {
    backendServices.gameDelete(mysqlPool, req, (result) => {
        res.redirect(`/courseDirector.html?gameDelete=${result ? "success" : "failed"}`);
    });
});

app.post('/generateDatabase', (req, res) => {
    // const result = backendServices.generateDatabase();
    // if (result) {
    //     res.redirect('/courseDirector.html?success=3');
    // } else {
    //     res.redirect('/courseDirector.html?error=3');
    // }
});

app.get('/getGames', (req, res) => {
    backendServices.getGames(mysqlPool, req, (result) => {
        res.send(result);
    });
});

// ----------------------------------------------------------------------------------------
// Game Routing (into the react app)
// ----------------------------------------------------------------------------------------

app.get('/game.html', (req, res) => {
    res.sendFile(__dirname + '/client/build/game.html');
});

// ----------------------------------------------------------------------------------------
// Socket Requests (client + server gameplay services)
// ----------------------------------------------------------------------------------------

io.sockets.on('connection', (socket) => {
    socket.on('disconnect', () => {
        //Disconnect Things
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
