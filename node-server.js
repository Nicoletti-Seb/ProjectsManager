var http = require('http');
var Multiroom = require('./modules_server/multiroomChatServer');
//var MongodbServer = require('./modules_server/mongodbServer');

module.exports = function NodeServer(app, hostname, port) {
	var server = null;

	function onStart() {
		// eslint-disable-next-line no-console
		console.log('Started connect web server on http://' + hostname + ':' + port);
	}

	function start() {
		server = http.createServer(app);
		server.on('listening', onStart);
		// create chat
		Multiroom.initMultiRoomChat(server);
		// connect mongodb
		//MongodbServer = new MongodbServer();
		server.listen(port);
	}

	return {
		start: start
	};
};

/*app.get('page1', project, function() {
	mongodb.addProject(project)
})*/
