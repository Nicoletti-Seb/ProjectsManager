module.exports = function MapService(io, socket) {
	function updateLocationUsers() {
		io.sockets.in(socket.currentProject._id).emit('updateLocationUsers',
			socket.currentProject.currentUsers);
	}

	socket.on('updateLocation', function onUpdateLocation(location) {
		socket.user.location = location;
		updateLocationUsers();
	});


	function close() {
		socket.removeAllListeners('updateLocation');
	}

	return {
		close: close,
		updateLocationUsers: updateLocationUsers
	};
};
