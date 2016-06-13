var http = require('http');
var server = http.createServer(function(req,res){

});



var io = require('socket.io').listen(server);
console.log('sockets open')
io.sockets.on('connect', function(socket){
	console.log('someone connected...')
	socket.on('message_to_server',function(data){
		console.log(data);
		io.sockets.emit("message_to_client", {
			message: data.message
		})
	})
})

server.listen(3001);
console.log("Listening on 3001");

