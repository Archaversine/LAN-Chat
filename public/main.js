
var socket;
var usrName = prompt("Enter your name:");

socket = io.connect("10.0.0.10:3000");
socket.on("incoming", manageMSG);
socket.on("join", logMSG);

var input = document.getElementById("msgbar");
input.addEventListener("keyup", function(event) {
	if (event.keyCode == 13) {
		send();
	}
});

join();

function join() {

	var msg = usrName + " joined.";

	var data = {
		name: usrName,
		text: msg
	}

	socket.emit("join", data);
}

function send() {
	var msg = document.getElementById("msgbar").value;
	var data = {
		name: usrName,
		text: msg
	}

	addUserMSG(msg);
	socket.emit("incoming", data);

	document.getElementById("msgbar").value = "";
}

function manageMSG(data) {
	addNewMessage(data.name, data.text);
}

function logMSG(data) {
	var msg = "* " + data.text;

	var elem = document.getElementById("msgdisplay");
	elem.innerHTML += "<p class=\"message\">" + msg + "</p>";
}

function addNewMessage(name, text) {

	var msg = name + ": " + text;

	var elem = document.getElementById("msgdisplay");
	elem.innerHTML += "<p class=\"message\">" + msg + "</p>";

}

function addUserMSG(text) {

	var msg = "Me: " + text;

	var elem = document.getElementById("msgdisplay");
	elem.innerHTML += "<p class=\"message user_message\">" + msg + "</p>";

}
