var myApp = angular.module('myApp', ['ngSanitize']);

var client = new FayeClient();
var subscribeChannels = [];
var publishChannels = [];
_.each(subscribeChannels, function(item){
    client.subscribeTo(item);
});

myApp.controller('ChatCtrl', ['$scope', function ($scope) {
     $scope.messageDisplay = "";

    //origin == "client", "server"
    var messageHtml = function(message, origin){
	return "<div class='"+origin+" chat-message'><div class='chat-message-container'><p>"+message+"</p></div></div>";
    };

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

myApp.controller('ListChannelsCtrl', ['$scope', function ($scope) {
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

    $scope.saveUsername = function(){
	$scope.username = $scope.user;
    };

}]);
