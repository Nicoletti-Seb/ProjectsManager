'use strict';

var ConnectionView = require('./scripts/connection-view');
var FormUserView = require('./scripts/formUser-view');


var connectionView = new ConnectionView();
var formUserView = new FormUserView();

module.exports = {

	start: function startConnection($container, page) {
		switch (page) {
		case 'register':
			$container.append(formUserView.$el);
			formUserView.delegateEvents().render();
			break;
		default:
			$container.append(connectionView.$el);
			connectionView.delegateEvents().render();
		}
	},

	stop: function stopConnection() {
		connectionView.remove();
	}
};
