//Create the server
const express = require("express");
const app = express();
const server = require("http").createServer(app);

//Session Setup
const sessionSecret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";
const sessionConfig = {
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true
};
const session = require("express-session")(sessionConfig);

app.use(session); //App has access to sessions
app.use(express.urlencoded()); //parses data and puts into req.body

//Server Routing
//TODO: Use middleware or reverse proxy to serve static files -> aka, anything with res.sendFile()
app.use("/", require("./server/router"));
app.use(express.static(__dirname + "/client/build"));

//Socket Setup
const io = require("socket.io")(server);
io.use(require("express-socket.io-session")(session)); //Socket has access to sessions
const socketSetup = require("./server/socketSetup");
io.sockets.on("connection", socket => {
	socketSetup(socket);
});

//Start the server
const port = process.env.PORT || 80;
server.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
