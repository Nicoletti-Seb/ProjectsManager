var ProjectService = require('./room_services/project-service');
var mongoDB = require('./mongodb');
var DataTest = require('./data-test');

/*eslint-disable vars-on-top */
exports.createSession = function createSession(server) {
    var io = require('socket.io').listen(server);
    mongoDB.connect().catch(function onError(err){console.log(err);});
    //var users = DataTest.users;
    var projects = [];


    /*(function initProjects() {
        projects = DataTest.projects;
        projects.forEach(function loopInitRoom(project) {
            project.currentUsers = [];
        });
    })();*/

    /*function connect(login, password, callback) {
        mongoDB.getUsers()
            .then(function onGetUsers(users) {
                 for (var i = 0, user = null; user = users[i]; i++) {
                    console.log("user", user);
                    if (user.login === login && user.password === password) {
                         return callback(user);
                    }
                }
            })
            .catch(callback);
    }*/

    /*function connect(login, password, callback) {
        console.log("connect");
        mongoDB.getUser(login, password)
            .then(function onGetUsers(user) {
                 //for (var i = 0, user = null; user = users[i]; i++) {
                    console.log("user", user);
                    //if (user.login === login && user.password === password) {
                        callback(user);
                    //}
                //}
            })
            .catch(function onError(err){ console.log(err);});
    }*/

    io.sockets.on('connection', function onConnection(socket) {
        socket.on('authentication', function onAuthentication(login, password) {
        	var user = mongoDB.getUser(login, password)
        	.then(function onConnect(user) {
				//console.log("user", user);
                if (!user) {
                    socket.emit('authenticate', { error: 'User not found...' });
                    return;
                }

                socket.user = user;
                socket.currentProject = null;
                ProjectService.listen(io, socket, projects);

                //notify client
                socket.emit('authenticate');

                })
        	.catch(function onError(err){ console.log(err);});
        });


        socket.on('disconnect', function onDisconnect() {
            socket.disconnect();
        });
    });
};
/*eslint-enable vars-on-top */