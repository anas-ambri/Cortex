var express = require('express')
, http = require('http')
, path = require('path');

var env = process.env.NODE_ENV || 'development';
var envConfig = require('./config/config.env')[env],
mongoose = require('mongoose');

mongoose.connect(envConfig.db);

var app = express();
require('./config/config.express')(app, envConfig);

require('./config/config.routes')(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log('Cortex server listening on port ' + app.get('port'));
});

var clients = {};
var socketsOfClients = {};

io.sockets.on('connection', function(socket) {
    socket.on('set username', function(username) {
	// Does username exists?
	if (clients[username] === undefined) {
	    // Does not exist ... so, proceed
	    clients[username] = socket.id;
	    socketsOfClients[socket.id] = username;
	    welcomeClient(socket.id, username);
	    informOthersNewClient(username);
	} else if (clients[username] === socket.id) {
	    // Ignore for now
	} else {
	    usernameAlreadyInUse(socket.id, username);
	}
    });

    socket.on('message', function(msg) {
	var srcUser;
	if (msg.inferSrcUser) {
	    // Infer user name based on the socket id
	    srcUser = socketsOfClients[socket.id];
	} else {
	    srcUser = msg.source;
	}
	
	if (msg.target == "All") {
	    // broadcast
	    io.sockets.emit('message',
			    {"source": srcUser,
			     "message": msg.message,
			     "target": msg.target});
	} else {
	    // Look up the socket id
	    io.sockets.sockets[clients[msg.target]].emit('message',
							 {"source": srcUser,
							  "message": msg.message,
							  "target": msg.target});
	}
    });
    
    socket.on('disconnect', function() {
	var userName = socketsOfClients[socket.id];
	delete socketsOfClients[socket.id];
	delete clients[userName];
	
	// relay this message to all the clients
	clientLeft(userName);
    })
})

var welcomeClient = function(socketId, username) {
    setTimeout(function() {
	console.log('Sending welcome msg to ' + username + ' at ' + socketId);
	io.sockets.sockets[socketId].emit('welcome', { "username" : username, "currentUsers": JSON.stringify(Object.keys(clients)) });
    }, 500);
}

var informOthersNewClient = function(newUsername) {
    Object.keys(socketsOfClients).forEach(function(sId) {
	io.sockets.sockets[sId].emit('newClient', { "username": newUsername });
    })
}

var usernameAlreadyInUse = function(sId, username) {
    setTimeout(function() {
	io.sockets.sockets[sId].emit('error', { "userNameInUse" : true });
    }, 500);
}

var clientLeft = function(username) {
    io.sockets.emit('userLeft', { "username": username });
}
