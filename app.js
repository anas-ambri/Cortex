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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
