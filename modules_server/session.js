var ProjectService = require('./room_services/project-service');

var DataTest = require('./data-test');

/*eslint-disable vars-on-top */
exports.createSession = function createSession(server) {
	var io = require('socket.io').listen(server);
	var users = DataTest.users;
	var projects = [];


	(function initProjects() {
		projects = DataTest.projects;
		projects.forEach(function loopInitRoom(project) {
			project.currentUsers = [];
		});
	})();

	function connect(login, password) {
		for (var i = 0, user = null; user = users[i]; i++) {
			if (user.login === login && user.password === password) {
				return user;
			}
		}

		return null;
	}

	io.sockets.on('connection', function onConnection(socket) {
		socket.on('authentication', function onAuthentication(login, password) {
			var user = connect(login, password);
			if (!user) {
				socket.emit('msgError', 'Les identifiants sont incorrectes...');
				return;
			}

			socket.user = user;
			socket.currentProject = null;
			ProjectService.listen(io, socket, projects);

			//notify client
			socket.emit('authenticate');
		});


		socket.on('disconnect', function onDisconnect() {
			socket.disconnect();
		});
	});
};
/*eslint-enable vars-on-top */
