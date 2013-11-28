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

myApp.factory('selectedChatChannel', function(){
    var channel;
    return {
	get : function() {return channel;},
	set : function(val){ channel = val;}
    };
});


myApp.controller('ChatCtrl', ['$scope', 'selectedChatChannel', function ($scope, selectedChatChannel) {
     $scope.messageDisplay = "";

    client.setHandleMessage(function(message){
	$scope.displayMessage(message.text, "server");
    });

    $scope.sendMessage = function(){
	var input = $scope.chatInput;
	if(!input)
	    return;
	var c = selectedChatChannel.get();
	client.publishTo(c, {text : input}, function(err){
	    if(err)
		$scope.inputError = "Error "+error.message;
	    else
		$scope.displayMessage(message, "client");
	});
    };

    $scope.displayMessage = function(message, origin){
	$(".chat-messages").append(messageHtml(message, origin));
    }
}]);

myApp.controller('ListChannelsCtrl', ['$scope', 'history', 'selectedChatChannel', function ($scope, history, selectedChatChannel) {

    $scope.subscribeChannels = subscribeChannels;
    $scope.publishChannels = publishChannels;

    $scope.publishChannelChanged = function(index){
	selectedChatChannel.set(publishChannels[index]);
    };

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
