var faye = require('faye')
, faye_redis = require('faye-redis')
, Persistent = require('./persistent');

function Cortex(){}

Cortex.prototype.listen = function(server, options){
    options = options || {};
    options.mount = options.mount || '/cortex';
    options.timeout = options.timeout || 45;
    options.engine = options.engine || {};
    options.engine.type = options.engine.type || faye_redis;
    options.engine.host = options.engine.host || 'localhost';
    options.engine.port = options.engine.port || 6379;

    this.bayeux = new faye.NodeAdapter(options);

    this.bayeux.attach(server);

    if(options && options.log){
	//Init logger
	require('./logger')(this.bayeux);
    }

    this.persistent = new Persistent();
    
    var self = this;
    this.bayeux.bind('publish', function(clientId, channel, data) {
	self.persistent.updatePublishedMessages(channel, data);
    });
    /*
     this.bayeux.bind('subscribe', function(clientId, channel) {
     var clientId = clientId;
     var channel = channel;
     self.persistent.addSubChannel(clientId, channel);
     });

     this.bayeux.bind('unsubscribe', function(clientId, channel) {
     var clientId = clientId;
     var channel = channel;
     self.persistent.removeSubChannel(clientId, channel);
     });
     */
};

Cortex.prototype.publish = function(channel, message, callback){
    var pub = this.bayeux.getClient().publish(channel, message);
    pub.then(function(){
	callback(null);
    }, function(err){
	callback(err);
    });
};

Cortex.prototype.welcomeNewClient = function(channel, newClient){
    var message = { "text" : "Everyone say hello to "+newClient };
    this.publish(channel, message, function(err){
	if(err)
	    console.log( "Error "+err+" when welcoming new client");
    });
};

Cortex.prototype.getMessagesChannel = function(channel, cb){
    this.persistent.getMessagesChannel(channel, cb);
};


exports = module.exports = Cortex;

