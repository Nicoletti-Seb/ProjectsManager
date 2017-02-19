var Backbone = require('backbone');
/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {
		onUpdateProjects: function (projects)
	}
*/
/* eslint-disable vars-on-top */
module.exports = Backbone.Model.extend((function RepositoryClass() {
	var socket = null;
	var projects = [];
	var options = {};


	function onUpdateProjects(newProjects) {
		if (!newProjects.error) {
			projects.splice(0, projects.length);
			Array.prototype.push.apply(projects, newProjects);
		}

		if (options.onUpdateProjects) {
			options.onUpdateProjects(newProjects);
		}
	}

	function init(session, opt) {
		socket = session;
		options = opt;
		socket.on('updateProjects', onUpdateProjects);
	}

	function getProjects() {
		if (!socket) {
			return;
		}

		socket.emit('getProjects');
	}

	function connectToProject(projectId) {
		if (!socket) {
			return;
		}

		socket.emit('connectToProject', projectId);
	}

	function close() {
		if (!socket) {
			return;
		}

		socket.off('updateProjects');
	}

	return {
		init: init,
		getProjects: getProjects,
		projects: projects,
		connectToProject: connectToProject,
		close: close
	};
})());
/* eslint-enable vars-on-top */
