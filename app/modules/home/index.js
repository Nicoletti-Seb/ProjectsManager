'use strict';

var HomeView = require('./scripts/home-view');
var FormProjectView = require('./scripts/form-project-view');

//Model
var socket = null;

//View
var formProjectView = new FormProjectView();
var homeView = new HomeView();

module.exports = function main(session) {
	socket = session;

	return {
		start: function startMonitor($container, page) {
			switch (page) {
			case 'CreateProject':
				$container.append(formProjectView.$el);
				formProjectView.delegateEvents().render();
				break;
			default:
				$container.append(homeView.$el);
				homeView.delegateEvents().render();
			}
		},

		stop: function stopMonitor() {
			formProjectView.remove();
			homeView.remove();
		}
	};
};
