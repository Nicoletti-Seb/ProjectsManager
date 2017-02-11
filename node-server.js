var http = require('http');
var Session = require('./modules_server/session');
//var MongodbServer = require('./modules_server/mongodbServer');

module.exports = function NodeServer(app, hostname, port) {
	var server = null;
	//var users = [];

	function onStart() {
		// eslint-disable-next-line no-console
		console.log('Started connect web server on http://' + hostname + ':' + port);
	}

	function start() {
		server = http.createServer(app);
		server.on('listening', onStart);

		//Create session
		Session.createSession(server);

		// connect mongodb
		//MongodbServer = new MongodbServer();

		//start server
		server.listen(port);
	}

	return {
		start: start
	};
};

/*app.get('page1', project, function() {
	mongodb.addProject(project)
})*/
