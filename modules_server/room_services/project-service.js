
exports.listen = function projectService(io, socket, projects) {
	function searchProjects(id) {
		for (var i in projects) {
			if (projects[i].id === id) {
				return projects[i];
			}
		}

		return null;
	}


	socket.on('coonnectToProject', function onConnectToRoom(projectId) {
		var project = searchProjects(projectId);
		if (!project) {
			console.log('project not found ', projectId);
			return;
		}

		socket.currentProject = project;
		project.currentUsers.push(socket.user);

		socket.join(project.name);
		socket.emit('connectedToProject');
		// echo to room 1 that a person has connected to their room
		socket.broadcast
			.to(project.name)
			.emit('updatechat', 'SERVER', socket.user.login + ' has connected to this room');
		socket.emit('updateProjects', projects);
	});

	/*socket.on('switchRoom', function onSwitchRoom(newroom) {
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
		// sent message to OLD room
		socket.broadcast
			.to(socket.room)
			.emit('updatechat', 'SERVER', socket.username + ' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast
			.to(newroom)
			.emit('updatechat', 'SERVER', socket.username + ' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});*/

	// when the user disconnects.. perform this
	socket.on('disconnectToProject', function onDisconnect() {
		delete socket.currentUsers[socket.user];

		io.sockets.emit('updateusers', projects);


		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
};
