'use strict';

var HomeView = require('./scripts/home-view');

var homeView = new HomeView();

module.exports = {

	start: function startMonitor($container) {
		$container.append(homeView.$el);
		homeView.startListening().delegateEvents().render();
	},

	stop: function stopMonitor() {
		homeView.free();
		homeView.remove();
	}
};
