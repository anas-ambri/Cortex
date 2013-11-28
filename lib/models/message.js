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
	this.findOne({pubChannel: channel}, function(err, result){
	    if(err)
		cb(err);
	    else if (!result) {
		cb(new Error("No messages on channel "+channel));
	    }
	    else {
		var arr = [];
		result.messages.forEach(function(message){
		    arr.push({
			content : message.content,
			timestamp: message.timestamp
		    });
		});
		cb(null, arr);
	    }
	});
    }
};

module.exports = mongoose.model('Messages', Message);
