var Backbone = require('backbone');
/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {
		onAuthenticate: function (error)
	}
*/
/* eslint-disable vars-on-top */
module.exports = Backbone.Model.extend((function ConnectionClass() {
	var socket = null;

	function init(session, opt) {
		socket = session;
		socket.on('authenticate', opt.onAuthenticate);
	}

	function authentication(login, password) {
		if (!socket) {
			return;
		}

		socket.emit('authentication', login, password);
	}

	function close() {
		if (!socket) {
			return;
		}

		socket.off('updateProjects');
	}

	return {
		init: init,
		authentication: authentication,
		close: close
	};
})());
/* eslint-enable vars-on-top */
