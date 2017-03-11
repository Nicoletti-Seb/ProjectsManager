'use strict';

var NotificationModel = require('./scripts/notification-model');
var NotificationView = require('./scripts/notification-view');

//Model
var socket = null;
var notificationModel = new NotificationModel();

//View
var notificationView = new NotificationView({ model: notificationModel });

module.exports = function main(session) {
	socket = session;

	return {
		start: function startNotification($notif) {
			notificationView.$el = $notif;
			notificationView.delegateEvents().render();

			notificationModel.init(socket, notificationView.getOptions());
		}
	};
};
