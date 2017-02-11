
var ChatService = require('./room_services/chat-service');
var MapService = require('./room_services/map-service');
var RepositoryService = require('./room_services/repository-service');

exports.createSession = function createSession(server) {
	var io = require('socket.io').listen(server);

	io.sockets.on('connection', function onConnection(socket) {
		ChatService.listen(io, socket);
		MapService.listen(io, socket);
		RepositoryService.listen(io, socket);
	});
};
