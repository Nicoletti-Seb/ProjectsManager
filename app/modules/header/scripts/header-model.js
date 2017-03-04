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
	var currentProject = null;


	function onAuthenticate(err) {
		if (!err) {
			isConnected = true;
		}

		if (options.onAuthenticate) {
			options.onAuthenticate(err);
		}
	}

	function onConnectedToProject(project) {
		if (!project.error) {
			currentProject = project;
		}

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
		currentProject = null;
	}

	function disconnectToProject() {
		if (!socket) {
			return;
		}

		socket.emit('disconnectToProject');
		currentProject = null;
	}

	function close() {
		if (!socket) {
			return;
		}

		socket.off('authenticate');
	}

	function setSocket(so) {
		socket = so;
	}

	return {
		init: init,
		isConnected: function () { return isConnected; },
		currentProject: function () { return currentProject; },
		disconnect: disconnect,
		disconnectToProject: disconnectToProject,
		setSocket: setSocket,
		close: close
	};
})());
/* eslint-enable vars-on-top */
