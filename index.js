var express = require('express')
, http = require('http')
, path = require('path')
, mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';
var envConfig = require('./config/config.env')[env];

mongoose.connect(envConfig.db);

var Cortex = require('./lib/');
var cortex = new Cortex();
var app = express();
require('./config/config.express')(app, cortex, envConfig);

require('./config/config.routes')(app);

var server = http.createServer(app);
cortex.listen(server, {log : true});

server.listen(app.get('port'), function(){
    console.log('Cortex server listening on port ' + app.get('port'));
});
