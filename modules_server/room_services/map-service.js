exports.listen = function mapService(io, socket) {
	socket.on('updateLocation', function onUpdateLocation(location) {
		var projectName = socket.currentProject.name;
		socket.user.location = location;
		io.sockets.in(projectName).emit('updateLocationUsers', socket.currentProject.currentUsers);
	});
};
