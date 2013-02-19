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

	socket.on('set avatar', function(name){
		var oldName = '';
		socket.get('avatar', function(error, name){
			oldName = name;
		});

		socket.set('avatar', name, function() {
			socket.emit('avatar set', name);
			var message = '';
			if (oldName)
				message = oldName + ' is now known as ' + name;
			else
				message = name + ' joined the conversation.';
			
			socket.broadcast.emit('notification', message);
		});
	});

	socket.on('postMessage', function(data){
		socket.get('avatar', function(error, name){
			data.avatar = name;
		});
		socket.broadcast.emit('message', data);
		socket.emit('message', data);
	});
});
