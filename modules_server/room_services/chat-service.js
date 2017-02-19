
exports.listen = function chatService(io, socket) {
	socket.on('sendchat', function onSendChat(data) {
		var projectName = socket.currentProject.name;
		var username = socket.user.login;
		io.sockets.in(projectName).emit('updatechat', username, data);
	});
};
