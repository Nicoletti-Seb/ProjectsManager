var http = require('http');


module.exports = function NodeServer(app, hostname, port) {
	var server = null;


	function onStart() {
		// eslint-disable-next-line no-console
		console.log('Started connect web server on http://' + hostname + ':' + port);
	}

	function start() {
		server = http.createServer(app);
		server.on('listening', onStart);
		server.listen(port);
	}

	return {
		start: start
	};
};
