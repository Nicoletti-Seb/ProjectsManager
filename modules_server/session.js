var ProjectService = require('./room_services/project-service');
var mongoDB = require('./mongodb');
//var DataTest = require('./data-test');

/*eslint-disable vars-on-top */
exports.createSession = function createSession(server) {
	var io = require('socket.io').listen(server);
	mongoDB.connect().catch(function onError(err) { console.log(err); });
	var projects = [];

	(function initProjects() {
		projects = DataTest.projects;
		projects.forEach(function loopInitRoom(project) {
			project.currentUsers = [];
		});
	})();

	io.sockets.on('connection', function onConnection(socket) {
		socket.on('authentication', function onAuthentication(login, password) {
			mongoDB.getUser(login, password)
				.then(function onGetUser(user) {
					console.log('user ', user);
					if (!user) {
						socket.emit('authenticate', { error: 'User not found...' });
						return;
					}

					socket.user = user;
					socket.currentProject = null;
					ProjectService.listen(io, socket, projects);

					//notify client
					socket.emit('authenticate');
				}).catch(function onError(err) { console.log('onGetUser ', err); });
		});


		socket.on('disconnect', function onDisconnect() {
			socket.disconnect();
		});
	});
};
/*eslint-enable vars-on-top */
