'use strict';

var ConnectionView = require('./scripts/connection-view');

var connectionView = new ConnectionView();

module.exports = {

	start: function startConnection($container) {
		$container.append(connectionView.$el);
		connectionView.delegateEvents().render();
	},

	stop: function stopConnection() {
		connectionView.remove();
	}
};
