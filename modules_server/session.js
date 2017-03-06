var ProjectService = require('./room_services/project-service');
var mongoDB = require('./mongodb');
var DataTest = require('./data-test');

/*eslint-disable vars-on-top */
exports.createSession = function createSession(server) {
    var io = require('socket.io').listen(server);
    mongoDB.connect();
    var users = DataTest.users;
    var projects = [];


    (function initProjects() {
        projects = DataTest.projects;
        projects.forEach(function loopInitRoom(project) {
            project.currentUsers = [];
        });
    })();

    function connect(login, password) {
        mongoDB.getUsers(function callback(err, users) {
            console.log("user", users);
            for (var i = 0, user = null; user = users[i]; i++) {
                console.log("user", user);
                if (user.login === login && user.password === password) {
                    return user;
                }
            }
            return null;
        });
    }

    io.sockets.on('connection', function onConnection(socket) {
        socket.on('authentication', function onAuthentication(login, password) {
            var user = connect(login, password);
            if (!user) {
                socket.emit('authenticate', { error: 'User not found...' });
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