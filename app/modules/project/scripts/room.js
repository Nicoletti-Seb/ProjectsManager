var Backbone = require('backbone');

/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {

		onError: function (err)
		onConnect: function ()
		onUpdateChat: function (username, data)
		onUpdateRooms: function (rooms, currentRoom)
	}

*/
module.exports = Backbone.Model.extend((function RoomClass() {
	var socket = null;
	var options = {};

	function init(session, opt) {
		socket = session;
		options = opt;
		socket.on('updatechat', options.onUpdateChat);
		socket.on('updaterooms', options.onUpdateRooms);
	}

	function addUser(user) {
		if (!socket) {
			return;
		}

		socket.emit('adduser', user);
	}

	function sendMessage(message) {
		if (!socket) {
			return;
		}

		socket.emit('sendchat', message);
	}


	function switchRoom(room) {
		if (!socket) {
			return;
		}

		socket.emit('switchRoom', room);
	}

	return {
		init: init,
		addUser: addUser,
		sendMessage: sendMessage,
		switchRoom: switchRoom
	};
})());
