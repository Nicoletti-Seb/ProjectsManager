var Backbone = require('backbone');
/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {
		onMessage: function (msg)
		onError: function(err)
	}
*/
/* eslint-disable vars-on-top */
module.exports = Backbone.Model.extend((function notificationClass() {
	var socket = null;
	var options = {};

	function onError(err) {
		if (options.onError) {
			options.onError(err);
		} else {
			console.log('error :' + err);
		}
	}

	function onMessage(message) {
		if (options.onMessage) {
			options.onMessage(message);
		} else {
			console.log('message :' + message);
		}
	}

	function init(session, opt) {
		socket = session;
		options = opt;
		socket.on('msgError', onError);
		socket.on('message', onMessage);
	}

	return {
		init: init
	};
})());
/* eslint-enable vars-on-top */
