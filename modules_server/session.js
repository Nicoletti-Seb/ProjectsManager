var ProjectService = require('./room_services/project-service');
var mongoDB = require('./mongodb');

/*eslint-disable vars-on-top */
exports.createSession = function createSession(server) {
	var io = require('socket.io').listen(server);
	mongoDB.connect().catch(function onError(err) { console.log(err); });

	io.sockets.on('connection', function onConnection(socket) {
		socket.on('authentication', function onAuthentication(login, password) {
			mongoDB.getUser(login, password)
				.then(function onGetUser(user) {
					if (!user) {
						socket.emit('msgError', 'Les identifiants sont incorrectes...');
						return;
					}

					socket.user = user;
					socket.currentProject = null;


					mongoDB.getProjects()
						.then(function onGetProjects(projects) {
							ProjectService.listen(io, socket, projects);
						}).catch(function onError(err) { console.log(err); });

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
