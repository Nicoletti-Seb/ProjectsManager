var Backbone = require('backbone');
/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {
		onAuthenticate: function (error)
		onConnectedToProject: function(project)
	}
*/
/* eslint-disable vars-on-top */
module.exports = Backbone.Model.extend((function HeaderClass() {
	var socket = null;
	var options = {};
	var isConnected = false;


	function onAuthenticate(user) {
		isConnected = true;
		socket.user = user;

		if (options.onAuthenticate) {
			options.onAuthenticate(user);
		}
	}

	function onConnectedToProject(project) {
		socket.project = project;

		if (options.onConnectedToProject) {
			options.onConnectedToProject(project);
		}
	}

	function init(session, opt) {
		socket = session;
		options = opt;
		socket.on('authenticate', onAuthenticate);
		socket.on('connectedToProject', onConnectedToProject);
	}

	function disconnect() {
		if (!socket) {
			return;
		}

		socket.emit('disconnect');
		socket.disconnect();

		isConnected = false;
		socket.project = null;
	}

	function disconnectToProject() {
		if (!socket) {
			return;
		}

		socket.emit('disconnectToProject');
		socket.project = null;
	}

	function close() {
		if (!socket) {
			return;
		}

		socket.off('authenticate');
	}

	return {
		init: init,
		isConnected: function () { return isConnected; },
		currentProject: function () { return socket && socket.project; },
		getLogin: function () { return socket && socket.user && socket.user.login; },
		disconnect: disconnect,
		disconnectToProject: disconnectToProject,
		close: close
	};
})());
/* eslint-enable vars-on-top */
