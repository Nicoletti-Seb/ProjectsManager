'use strict';

var Backbone = require('backbone');

var Map = require('./scripts/map');
var Room = require('./scripts/room');
var MapView = require('./scripts/map-view');
var RoomView = require('./scripts/room-view');


//Model
var map = null;
var room = new Room();

//Views
var mapView = new MapView({ model: map });
var roomView = new RoomView({ model: room });


//Loading async map
window.onLoadMap = function onLoadMap() {
	console.log('onLoadMap ', mapView.el.querySelector('.map'));
	map = new Map(mapView.el.querySelector('.map'), {});
	mapView.model = map;
};

module.exports = {
	start: function startProject($container, page) {
		switch (page) {
		case 'map':
			this.initMapPage($container);
			break;
		default:
			this.initRoomPage($container);
		}
	},

	stop: function stopProject() {
		//Model
		room.stop();

		//View
		mapView.free();
		mapView.remove();

		roomView.free();
		roomView.remove();
	},

	initMapPage: function initMapPage($container) {
		$container.append(mapView.el);
		mapView.delegateEvents().render();
	},

	initRoomPage: function initRoomPage($container) {
		$container.append(roomView.el);
		roomView.delegateEvents().render();

		//init model
		room.connect(roomView.getOptions());
	}
};
