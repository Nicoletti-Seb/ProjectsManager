var ChatService = require('./chat-service');
var MapService = require('./map-service');
var RepositoryService = require('./repository-service');
var mongoDB = require('../mongodb');

exports.listen = function projectService(io, socket, projects) {
	var chatService = null;
	var mapService = null;
	var repositoryService = null;

	function initServices() {
		chatService = new ChatService(io, socket);
		mapService = new MapService(io, socket);
		repositoryService = new RepositoryService(io, socket);
	}
	initServices();

	function closeServices() {
		chatService.close();
		mapService.close();
		repositoryService.close();
	}

	function updateServices() {
		closeServices();
		initServices();
	}

	function searchProjects(id) {
		for(var i in projects) {
			if (projects[i]._id.toHexString() === id) {
				return projects[i];
			}
		}

		return null;
	}


	function deleteUser(users) {
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === socket.user.id) {
				users.splice(i, 1);
				return;
			}
		}
	}

	socket.on('connectToProject', function onConnectToRoom(projectId) {
		var project = searchProjects(projectId);
		if (!project) {
			socket.emit('msgError', 'Le projet avec l\'id ' + projectId + ' n\'existe pas...');
			return;
		}

		socket.currentProject = project;
		project.currentUsers.push(socket.user);

		socket.join(project._id);

		updateServices();

		//notify users
		socket.emit('connectedToProject', project);
		socket.broadcast
			.to(project._id)
			.emit('updatechat', 'SERVER', socket.user.login + ' has connected to this room');
	});


	socket.on('disconnectToProject', function onDisconnect() {
		deleteUser(socket.currentProject.currentUsers);

		io.sockets.emit('updateusers', projects);


		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);

		//update map services
		mapService.updateLocationUsers();
	});

	function getProjectsUser(user) {
		var results = [];

		user.projects.forEach(function getProjectId(idProject) {
			for (var i in projects) {
				// ObjectId.toHexString
				if (projects[i]._id.toHexString() === idProject.toHexString()) {
					results.push(projects[i]);
					return;
				}
			}
		});

		return results;
	}

	socket.on('getProjects', function onGetProjects() {
		socket.emit('updateProjects', getProjectsUser(socket.user));
	});

	socket.on('createProject', function onCreateProject(title, desc, members) {
		// owner of the project
		var leader = socket.user;
		// leader + members
		if (!members) {
			members = leader.login;
		}
		if (members.indexOf(leader.login) === -1) {
			members.concat(', ', leader.login);
		}

		members = members.replace(' ', '').split(',');
		// create dossier in bd and link all user on it
		mongoDB.createProject(title, desc, members, leader._id)
		.then(function onGetCreateProjetct(response) {
			socket.emit('message', 'The project \'' + response.ops[0].name + '\' has been created');
		}).catch(function onError(err) {
			socket.emit('msgError', 'The creation project failed');
			console.log('create project failed', err);
		});
		// create repositorie by RepositoryService
		// update project list
		socket.emit('updateProjects', getProjectsUser(socket.user));
	});

	socket.on('register',
		function onRegister(login, password, firstname, lastname, email, speciality) {
			mongoDB.addUser(login, password, firstname, lastname, email, speciality)
			.then(function onGetRegister(response) {
				socket.emit('message', 'The user \'' + response.ops[0].login + '\' has been created');
			}).catch(function onError(err) {
				socket.emit('msgError', 'The creation user failed');
				console.log('create user failed', err);
			});
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
};
