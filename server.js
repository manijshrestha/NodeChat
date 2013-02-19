//Node.js Chat client Server

var app = require('http').createServer(handler),
io = require ('socket.io').listen(app),
static = require('node-static');

// Make all the files in the current directory accessible
var fileServer = new static.Server('./');

app.listen(8080);

function handler(request, response) {
	request.addListener('end', function () {
		fileServer.serve(request, response);
	});
}

io.sockets.on('connection', function(socket) {
	socket.on('postMessage', function(data){
		socket.broadcast.emit('message', data);
		socket.emit('message', {text: data.text});
	});
});
