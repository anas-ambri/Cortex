function Logger(server){
    server.bind('handshake', function(clientId){
	console.log( '[HANDSHAKE] ' + clientId );
    });

    server.bind('subscribe', function(clientId, channel) {
	console.log('[ SUBSCRIBE] ' + clientId + ' -> ' + channel);
    });

    server.bind('publish', function(clientId, channel, data) {
	console.log('[ PUBLISH] ' + clientId + ' -> ' + channel + ' : ' + JSON.stringify(data));
    });

    server.bind('unsubscribe', function(clientId, channel) {
	console.log('[UNSUBSCRIBE] ' + clientId + ' -> ' + channel);
    });

    server.bind('disconnect', function(clientId) {
	console.log('[ DISCONNECT] ' + clientId);
    });
}

module.exports = exports = Logger;
