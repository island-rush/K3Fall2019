// ----------------------------------------------------------------------------------------
// Server Setup and Configuration
// ----------------------------------------------------------------------------------------

const port = process.env.PORT || 80;

const sessionSecret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const esConfig = {
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true
};
const session = require("express-session")(esConfig);
const sharedsession = require("express-socket.io-session");
app.use(session);
app.use(express.urlencoded());
io.use(sharedsession(session));

const csvparse = require("csv-array");
let distanceMatrix = [];
csvparse.parseCSV(
	"./serverItems/distanceMatrix.csv",
	data => {
		distanceMatrix = data;
	},
	false
);

const backendServices = require("./serverItems/backendServices");

const router = require("./serverItems/router");
app.use("/", router);

app.use(express.static(__dirname + "/client/build"));

io.sockets.on("connection", socket => {
	backendServices.socketSetup(socket);
});

// ----------------------------------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------------------------------

server.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
