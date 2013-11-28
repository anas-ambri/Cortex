var myApp = angular.module('myApp', ['ngSanitize']);

var client = new FayeClient();
var subscribeChannels = [];
var publishChannels = [];
_.each(subscribeChannels, function(item){
    client.subscribeTo(item);
});

//origin == "client", "server"
var messageHtml = function(message, origin){
    return "<div class='"+origin+" chat-message'><div class='chat-message-container'><p>"+message+"</p></div></div>";
};

myApp.factory('history', function($http){
    return {
	getHistory : function(channel){
	    return $http.get('/history?channel='+channel);
	}
    };
});

myApp.controller('ChatCtrl', ['$scope', function ($scope) {
     $scope.messageDisplay = "";

    client.setHandleMessage(function(message){
	$scope.displayMessage(message.text, "server");
    });

    $scope.sendMessage = function(){
	var input = $scope.chatInput;
	if(!input)
	    return;
	var res = input.match(/^\$(.+)\$(.+)$/);
	if(!res)
	    $scope.inputError = "Message must be of form '$(.*)$(.*)'";
	else {
	    $scope.inputError = "";
	    var channel = res[1];
	    var message = res[2];
	    if(!_.find(publishChannels, function(item){return item == channel;}))
	       publishChannels.push(channel);
	   
	    client.publishTo(channel, {text : message}, function(err){
		if(err)
		    $scope.inputError = "Error "+error.message;
		else
		    $scope.displayMessage(message, "client");
	    });
	}
    };

    $scope.displayMessage = function(message, origin){
	$(".chat-messages").append(messageHtml(message, origin));
    }
}]);

myApp.controller('ListChannelsCtrl', ['$scope', 'history', function ($scope, history) {
    $scope.subscribeChannels = subscribeChannels;
    $scope.publishChannels = publishChannels;

    $scope.addSubscribeChannel = function(){
	var channel = $scope.newSubscribeChannel;
	if(channel){
	    $scope.subscribeChannels.push(channel)
	    client.subscribeTo(channel);
	}
    };

    $scope.removeSubscribeChannel = function(index){
	var channel = $scope.subscribeChannels[index];
	client.unsubscribeFrom(channel);
	$scope.subscribeChannels.splice(index, 1);
    };

    
    $scope.addPublishChannel = function(){
	var channel = $scope.newPublishChannel;
	if(channel)
	    publishChannels.push(channel);
    };

    $scope.removePublishChannel = function(index){
	$scope.publishChannels.splice(index, 1);
    };

    $scope.fetchHistory = function(index){
	var channel = $scope.subscribeChannels[index];
	history.getHistory(channel).then(
	    function(data){
		data.data.forEach(function(message){
		    var date = new Date(message.timestamp);
		    date = date.toUTCString();
		    var content = message.content.text;
		    $scope.displayMessage("Time:"+date+", Content: "+content, "server");
		})
	    },
	    function(reason){
		$scope.$emit('error', data.reason);
	    });
    };

    $scope.chooseUsername = function(){
	$scope.user = $scope.username;
    };

    $scope.displayMessage = function(message, origin){
	$(".chat-messages").append(messageHtml(message, origin));
    }
}]);
