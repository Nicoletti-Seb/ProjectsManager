
module.exports = function ChatService(io, socket) {
	socket.on('sendchat', function onSendChat(data) {
		var username = socket.user.login;
		io.sockets.in(socket.currentProject._id).emit('updatechat', username, data);
	});

	function close() {
		socket.removeAllListeners('sendchat');
	}

	return {
		close: close
	};
};
