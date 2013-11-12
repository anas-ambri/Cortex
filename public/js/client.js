 var socket = io.connect('http://localhost');
socket.on('connection', function (data) {
    console.log(data);
});


socket.on('message', function (data) {
    console.log(data);
});


setTimeout(function(){
    socket.emit('set username', "test1", null);
}, 3000);


