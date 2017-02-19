module.exports = function MapService(io, socket) {
	socket.on('updateLocation', function onUpdateLocation(location) {
		var projectName = socket.currentProject.name;
		socket.user.location = location;
		io.sockets.in(projectName).emit('updateLocationUsers', socket.currentProject.currentUsers);
	});

	function close() {
		socket.removeAllListeners('updateLocation');
	}

	return {
		close: close
	};
};
