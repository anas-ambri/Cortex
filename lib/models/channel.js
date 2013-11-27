var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Channel = new Schema({
    clientId : String,
    pubChannels : [String],
    subChannels : [String]
});

Channel.methods = {
    addPubChannel : function(channel, cb){
	if(!channel)
	    cb(new Error("No channel provided"));
	else {
	    this.pubChannels.push(channel);
	    this.save(cb);
	}
    },
    addSubChannel : function(channel, cb){
	if(!channel)
	    cb(new Error("No channel provided"));
	else {
	    this.subChannels.push(channel);
	    this.save(cb);
	}
    },
    removePubChannel : function(channel, cb){
	if(!channel)
	    cb(new Error("No channel provided"));
	else {
	    var index = findIndex(this.pubChannels, channel);
	    if(index) {
		this.pubChannels.splice(index, 1);
		this.save(cb);
	    }
	}
    },
    removeSubChannel : function(channel, cb){
	if(!channel)
	    cb(new Error("No channel provided"));
	else {
	    var index = findIndex(this.subChannels, channel);
	    if(index) {
		this.subChannels.splice(index, 1);
		this.save(cb);
	    }
	}
    }
};

function findIndex(arr, value){
    for(var i = 0 ; i < arr.length ; ++i){
	if(arr[i] == value)
	    return i; 
    }
    return undefined;
}

Channel.statics = {
    getClientChannels : function(clientId, cb){
	Channel.findOne({clientId: clientId}, cb);
    },
    getSubClientChannels : function(clientId, cb){
	Channel.getClientChannels(clientId, function(err, doc){
	    if(err)
		cb(err);
	    else if(!doc) {
		cb(null, new Error("Client "+clientId+ " not found"));
	    } else {
		cb(null, doc.subChannels);
	    }	    
	});
    },
    getPubClientChannels : function(clientId, cb){
	Channel.getClientChannels(clientId, function(err, doc){
	    if(err)
		cb(err);
	    else if(!doc) {
		cb(null, new Error("Client "+clientId+ " not found"));
	    } else {
		cb(null, doc.subChannels);
	    }	    
	});
    }
};

module.exports = mongoose.model('Channels', Channel);
