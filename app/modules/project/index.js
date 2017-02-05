'use strict';

var ProjectView = require('./scripts/project-view');

var projectView = new ProjectView();

module.exports = {

	start: function startProject($container) {
		$container.append(projectView.el);
		projectView.delegateEvents().render();
	},

	stop: function stopProject() {
		projectView.free();
		projectView.remove();
	}
};
