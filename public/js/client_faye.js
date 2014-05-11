function FayeClient(){
    this.client = new Faye.Client('http://192.168.42.1:3000/cortex',
				  {
				      timeout: 120,
				      retry : 10
				  });
    this.pubChannels =  [];
    this.subChannels =  [];
    this.subscriptions = {};
};

FayeClient.prototype.addExtension = function(extension){
    this.client.addExtension(extension);
}


FayeClient.prototype.publishTo = function(channel, message, callback){
    this.client.publish(channel, message).then(function() {
	callback(null);
    }, function(error) {
	callback(error);
    });
}

FayeClient.prototype.publishToAll = function(message, callback){
    var self = this;
    var message = message;
    var arr = [];
    _.each(this.pubChannels, function(channel, index){
	self.publishTo(channel, message, function(err){
	    if(err)
		arr.push(err);
	    if(index == self.pubChannels.length -1) {
		if(arr)
		    callback(arr);
		else
		    callback(null);
	    }
	});
    });
}

FayeClient.prototype.setHandleMessage = function(callback){
    this.handleMessage = callback;
}

FayeClient.prototype.subscribeTo = function(channel){
    var index = _.find(this.subChannels, function(ch){ return channel == ch; });
    if(!index) {
	var self = this;
	var subscription = this.client.subscribe(channel, this.handleMessage)
	    .then(function(){
		self.subscriptions[channel] = subscription;
		self.subChannels.push(channel);
	    });
    }
}

FayeClient.prototype.unsubscribeFrom = function(channel){
    var index = _.find(this.subChannels, function(ch){ return channel == ch; });
    if(index){
	delete this.subscriptions.channel;
	this.subChannels.splice(index, 1);
    }
}
