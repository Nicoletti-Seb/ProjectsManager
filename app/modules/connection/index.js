'use strict';
var ConnectionModel = require('./scripts/connection-model');
var ConnectionView = require('./scripts/connection-view');
var FormUserView = require('./scripts/formUser-view');

//Model
var socket = null;
var connectionModel = new ConnectionModel();

//View
var connectionView = new ConnectionView({ model: connectionModel });
var formUserView = new FormUserView({ model: connectionModel });

module.exports = function main(session) {
	socket = session;

	return {
		start: function startConnection($container, page) {
			switch (page) {
			case 'register':
				this.initRegisterPage($container);
				break;
			default:
				this.initConnectionPage($container);
			}
		},

		stop: function stopConnection() {
			connectionModel.close();

			connectionView.remove();
		},

		initConnectionPage: function initConnectionPage($container) {
			$container.append(connectionView.$el);
			connectionView.delegateEvents().render();

			connectionModel.init(socket, connectionView.getOptions());
		},

		initRegisterPage: function initConnectionPage($container) {
			$container.append(formUserView.$el);
			formUserView.delegateEvents().render();

			connectionModel.init(socket, formUserView.getOptions());
		},

		setSocket: function setSocket(so) {
			socket = so;
			connectionModel.socket = socket;
			connectionModel.setSocket(socket);
		}
	};
};
