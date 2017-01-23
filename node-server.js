var http = require('http');
var Multiroom = require('./modules_server/multiroomChatServer');

module.exports = function NodeServer(app, hostname, port) {
	var server = null;
	console.log("multiroom:", Multiroom);
	function onConnection() {
		// appel multiroom
		Multiroom.initMultiRoomChat(server);
		console.log("onConnection");
	}

	function onStart() {
		// eslint-disable-next-line no-console
		console.log('Started connect web server on http://' + hostname + ':' + port);
	}

	function start() {
		server = http.createServer(app);
		server.on('listening', onStart);
		server.on('connect', onConnection);
		server.listen(port);
	}

	return {
		start: start
	};
};
