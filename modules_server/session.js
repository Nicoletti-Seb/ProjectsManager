var ProjectService = require('./room_services/project-service');
var mongoDB = require('./mongodb');

/*eslint-disable vars-on-top */
exports.createSession = function createSession(server) {
	var io = require('socket.io').listen(server);
	var projects = [];
	mongoDB.connect()
		.then(function onConnect() {
			console.log('Connection a la base de donnée mongoDB');
			console.log('Chargement des projets...');
			mongoDB.getProjects()
				.then(function onGetProjects(projectList) {
					projects = projectList;
					console.log('Liste des projets chargés: Ok !');
				}).catch(function onError(err) { console.log(err); });
		})
		.catch(function onError(err) { console.log(err); });

	io.sockets.on('connection', function onConnection(socket) {
		socket.on('authentication', function onAuthentication(login, password) {
			mongoDB.getUser(login, password)
				.then(function onGetUser(user) {
					if (!user) {
						socket.emit('msgError', 'Les identifiants sont incorrectes...');
						return;
					}

					//Init session
					socket.user = user;
					socket.currentProject = null;

					//Start services
					ProjectService.listen(io, socket, projects);

					//Return connection
					socket.emit('authenticate');
				}).catch(function onError(err) { console.log('onGetUser ', err); });
		});


		socket.on('disconnect', function onDisconnect() {
			socket.disconnect();
		});
	});
};
/*eslint-enable vars-on-top */
