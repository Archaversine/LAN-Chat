const port = 3000; // port to listen on 

class Client {

	constructor(name, id) {
		this.name = name;
		this.id = id;
	}

}

var clients = [];

var express = require('express'); // import express module
var app = express(); // create express application
var server = app.listen(port); // listen on port

app.use(express.static("public")); // show public directory to clients

console.log("Socket server is running");

var socket = require("socket.io"); // import socket.io module
var io = socket(server); // io/socket manager

io.sockets.on("connection", newConnection); // new newConnection function upon new connection

function newConnection(socket) {
	socket.on("incoming", newMessage);
	socket.on("join", joinMessage);

	function newMessage(data) {
		socket.broadcast.emit("incoming", data);
	}

	function joinMessage(data) {
		socket.broadcast.emit("join", data);
		console.log(data.name + " joined.");

		clients.push(new Client(data.name, socket.id));
	}

	socket.on("disconnect", function() {

		var cliName = getClientName(socket.id);
		removeClient(socket.id);

		var data = {
			name: cliName,
			text: cliName + " left."
		}

		socket.broadcast.emit("join", data);

		console.log(data.name + " disconnected.");
	});
}

function getClientName(clientId) {

	var name;

	for (var client of clients) {
		if (client.id == clientId) {
			name = client.name;
		}
	}

	return name;
	
}

function removeClient(clientId) {

	for (var i = clients.length - 1; i >= 0; i--) {
		if (clients[i].id == clientId) {
			clients.splice(i, 1);
			return;
		}
	}
	
}
