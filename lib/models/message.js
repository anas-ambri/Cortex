var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
    pubChannel : String,
    messages : [
	{
	    timestamp : {type: Date, default: Date.now},
	    content : Schema.Types.Mixed
	}
    ]
});

Message.methods = {
    addMessage : function(message, cb){
	if(!message)
	    cb(new Error("No message provided"));
	else {
	    this.messages.push( { content : message });
	    this.save(cb);
	}
    }
};

Message.statics = {
    getMessagesChannel : function(channel, cb){
	Message.findOne({pubChannel: channel}, cb);
    }
};

module.exports = mongoose.model('Messages', Message);
