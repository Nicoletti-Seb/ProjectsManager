'use strict';

var HeaderModel = require('./scripts/header-model');
var HeaderView = require('./scripts/header-view');

//Model
var socket = null;
var headerModel = new HeaderModel();

//View
var headerView = new HeaderView({ model: headerModel });

module.exports = function main(session) {
	socket = session;

	return {
		start: function startMonitor($header) {
			$header.append(headerView.$el);
			headerView.delegateEvents().render();

			headerModel.init(socket, headerView.getOptions());
		}
	};
};
