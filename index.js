// ----------------------------------------------------------------------------------------
// Server Setup and Configuration
// ----------------------------------------------------------------------------------------

const port = process.env.PORT || 80;
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session')({
    secret: process.env.SESSION_SECRET || "sdlkjslfjk",
    resave: true,
    saveUninitialized: true
});
const sharedsession = require('express-socket.io-session');
app.use(session);
io.use(sharedsession(session));
const md5 = require('md5');
const mysql = require('mysql');
// const config = {
//     host: process.env.DB_HOSTNAME || "localhost",
//     user: process.env.DB_USERNAME || "root",
//     password: process.env.DB_PASSWORD || "",
//     database: process.env.DB_NAME || "k3"
// }

const csvparse = require('csv-array');
let distanceMatrix = [];
csvparse.parseCSV('distanceMatrix.csv', (data) => { distanceMatrix = data; }, false);

// ----------------------------------------------------------------------------------------
// Internal Routing
// ----------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ----------------------------------------------------------------------------------------
// Admin Services / Routing
// ----------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------
// Game Routing
// ----------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------
// Socket Requests (client + server gameplay services)
// ----------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------
// Start taking in requests to the server
// ----------------------------------------------------------------------------------------

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
