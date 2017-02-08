var Backbone = require('backbone');
var Map = require('./map');
var Room = require('./room');

var currentRoom = null;
var map = null;

module.exports = Backbone.Model.extend({

	stop: function stop() {
		if (currentRoom) {
			currentRoom.stop();
		}
	},

	// ----- Room function
	initRoom: function initRoom(options) {
		currentRoom = new Room(options);
	},

	sendMessage: function sendMessage(message) {
		if (!currentRoom) {
			return;
		}

		currentRoom.sendMessage(message);
	},

	switchRoom: function switchRoom(room) {
		if (!currentRoom) {
			return;
		}

		currentRoom.switchRoom(room);
	},

	// ------  Map Functions
	initMap: function initMap(el) {
		map = new Map(el, {
			markerDraggable: false
		});
	},

	// location = { y, x }
	addMarker: function addMarker(location) {
		if (!map) {
			return;
		}

		map.addMarker(location);
	}
});
