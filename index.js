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
const backendServices = require('./backendServices.js');
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
const mysql = require('mysql');
// const config = {
//     host: DatabaseHostname,
//     user: DatabaseUsername,
//     password: DatabasePassword,
//     database: DatabaseName
// }

const csvparse = require('csv-array');
let distanceMatrix = [];
csvparse.parseCSV('distanceMatrix.csv', (data) => { distanceMatrix = data; }, false);

app.use(express.static(__dirname + '/client/build'));

// ----------------------------------------------------------------------------------------
// Internal Routing (unrestricted access)
// ----------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/troubleshoot.html', (req, res) => {
    res.sendFile(__dirname + '/troubleshoot.html');
});

app.get('/credits.html', (req, res) => {
    res.sendFile(__dirname + '/credits.html');
});

// ----------------------------------------------------------------------------------------
// Teacher and Course Director Services / Routing
// ----------------------------------------------------------------------------------------

app.get('/teacher.html', (req, res) => {
    res.sendFile(__dirname + '/teacher.html');
});

app.get('/courseDirector.html', (req, res) => {
    res.sendFile(__dirname + '/courseDirector.html');
});

app.post('/gameAdd', (req, res) => {
    const result = backendServices.gameAdd(req.body.adminSection, req.body.adminInstructor, req.body.adminPassword);
    if (result) {
        res.redirect('/courseDirector.html?success=1');
    } else {
        res.redirect('/courseDirector.html?error=1');
    }
});

app.post('/gameDelete', (req, res) => {
    const result = backendServices.gameDelete(req.body.gameId);
    if (result) {
        res.redirect('/courseDirector.html?success=2');
    } else {
        res.redirect('/courseDirector.html?error=2');
    }
});

app.post('/generateDatabase', (req, res) => {
    const result = backendServices.generateDatabase();
    if (result) {
        res.redirect('/courseDirector.html?success=3');
    } else {
        res.redirect('/courseDirector.html?error=3');
    }
});

app.get('/getGames', (req, res) => {
    console.log('got games');
    const result = backendServices.getGames();
    res.send(result);
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
