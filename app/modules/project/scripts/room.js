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

	function connect(opt) {
		options = opt;
		socket = require('socket.io-client')();
		socket.on('error', options.onError);
		socket.on('connect', options.onConnect);
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

	function stop() {
		if (!socket) {
			return;
		}

		socket.disconnect();
		socket = null;
	}

	return {
		connect: connect,
		addUser: addUser,
		sendMessage: sendMessage,
		switchRoom: switchRoom,
		stop: stop
	};
})());
