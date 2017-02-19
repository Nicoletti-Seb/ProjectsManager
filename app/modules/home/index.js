'use strict';

var HomeModel = require('./scripts/home-model');
var HomeView = require('./scripts/home-view');
var FormProjectView = require('./scripts/form-project-view');

//Model
var socket = null;
var homeModel = new HomeModel();

//View
var formProjectView = new FormProjectView({ model: homeModel });
var homeView = new HomeView({ model: homeModel });

module.exports = function main(session) {
	socket = session;

	return {
		start: function startMonitor($container, page) {
			switch (page) {
			case 'CreateProject':
				this.initCreateProjectPage($container);
				break;
			default:
				this.initProjectPage($container);
			}
		},

		stop: function stopMonitor() {
			homeModel.close();

			formProjectView.remove();
			homeView.remove();
		},

		initProjectPage: function initProjectPage($container) {
			$container.append(homeView.$el);
			homeView.delegateEvents().render();

			homeModel.init(socket, homeView.getOptions());
			homeModel.getProjects();
		},

		initCreateProjectPage: function initCreateProjectPage($container) {
			$container.append(formProjectView.$el);
			formProjectView.delegateEvents().render();

			homeModel.init(socket, formProjectView.getOptions());
		}
	};
};
