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

var Cortex = require('./lib/');
var cortex = new Cortex();
cortex.init(server, {log : true});

server.listen(app.get('port'), function(){
    console.log('Cortex server listening on port ' + app.get('port'));
});

setTimeout(function(){
    cortex.welcomeNewClient("/chat/magnetic", "1234");
}, 5000);
