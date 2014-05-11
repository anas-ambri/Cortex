var mongoose = require('mongoose'),
    Messages = require('./models/message'),
    Channels = require('./models/channel');

function Persistent(){}

Persistent.prototype.updatePublishedMessages = function(channel, data){
    Messages.findOne({pubChannel : channel}, function(err, result){
	if(err){
	    console.log( "Error "+err+" when trying to find messages on channel "+channel);
	}
	else if (!result){
	    var record = new Messages({
		pubChannel : channel,
		messages : [{
		    content: data,
		    timestamp : new Date()
		}]
	    });
	    record.save(function(err, res){
		if(err)
		    console.log("Error "+err+" when trying to add new channel "+channel);
	    });
	} else {
	    result.addMessage(data, function(err){
		if(err){
		    console.log( "Error "+err+" when trying to add messages to channel "+channel);
		} else
		    console.log( "Added messages" );
	    });
	}
    });
};

Persistent.prototype.getMessagesChannel = function(channel, cb){
    Messages.getMessagesChannel(channel, cb);
};


Persistent.prototype.getPubChannels = function(clientId, cb){
    Channels.getPubClientChannels(clientId, cb);
};

Persistent.prototype.getSubChannels = function(clientId, cb){
    Channels.getSubClientChannels(clientId, cb);
};

Persistent.prototype.addPubChannel = function(clientId, channel){
    Channels.findOne({clientId : clientId}, function(err, client){
	if(err){
	    console.log( "Error "+err+" when trying to add pub channel "+channel+" to client "+clientId);
	}
	else if (!client){
	    var channel = new Channels({
		clientId : clientId,
		pubChannels : [channel],
		subChannels : []
	    });
	    channel.save(function(err, res){
		console.log("Error "+err+" when trying to add new client "+clientId+" with channel "+channel);
	    });
	} else {
	    client.addPubChannel(channel, function(err){
		if(err){
		    console.log( "Error "+err+" when trying to add pub channel "+channel+" to client "+clientId);
		} else
		    console.log( "Added pub channel" );
	    });
	}
    });
};

Persistent.prototype.addSubChannel = function(clientId, channel){
    Channels.findOne({clientId : clientId}, function(err, client){
	if(err){
	    console.log( "Error "+err+" when trying to subscribe client "+clientId+" to channel "+channel);
	}
	else if (!client){
	    var channel = new Channels({
		clientId : clientId,
		pubChannels : [],
		subChannels : [channel]
	    });
	    channel.save(function(err, res){
		console.log("Error "+err+" when trying to add new client "+clientId+" with channel "+channel);
	    });
	} else {
	    client.addSubChannel(channel, function(err){
		if(err){
		    console.log("Error "+err+" when trying to subscribe client "+clientId+" to channel "+channel);
		} else
		    console.log( "Added sub channel" );
	    });
	}
    });
};

Persistent.prototype.removeSubChannel = function(clientId, channel){
    Channels.findOne({clientId : clientId}, function(err, client){
	if(err){
	    console.log( "Error "+err+" when trying to remove sub channel "+channel+" to client "+clientId);
	}
	else if (!client){
	    console.log("Client "+clientId+ " not found when removing sub channel");
	} else {
	    client.addSubChannel(channel, function(err){
		if(err){
		    console.log( "Error "+err+" when trying to remove sub channel "+channel+" to client "+clientId);
		} else
		    console.log( "Removed sub channel" );
	    });
	}
    });
};

Persistent.prototype.removePubChannel = function(clientId, channel, cb){
    Channels.findOne({clientId : clientId}, function(err, client){
	if(err){
	    console.log( "Error "+err+" when trying to remove pub channel "+channel+" to client "+clientId);
	}
	else if (!client){
	    console.log("Client "+clientId+ " not found when removing pub channel");
	} else {
	    client.addSubChannel(channel, function(err){
		if(err){
		    console.log( "Error "+err+" when trying to remove pub channel "+channel+" to client "+clientId);
		} else
		    console.log( "Removed pub channel" );
	    });
	}
    });
};

module.exports = exports = Persistent;
