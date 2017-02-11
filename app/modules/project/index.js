'use strict';

var Map = require('./scripts/map');
var Room = require('./scripts/room');
var Repository = require('./scripts/repository');

var MapView = require('./scripts/map-view');
var RoomView = require('./scripts/room-view');
var RepositoryView = require('./scripts/repository-view');


//Model
var map = null;
var room = new Room();
var repository = new Repository();

//Views
var mapView = new MapView({ model: map });
var roomView = new RoomView({ model: room });
var repositoryView = new RepositoryView({ model: repository });


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
		case 'repository':
			this.initRepositoryPage($container);
			break;
		default:
			this.initRoomPage($container);
		}
	},

	stop: function stopProject() {
		//Model
		room.stop();
		repository.stop();

		//View
		mapView.free();
		mapView.remove();

		roomView.free();
		roomView.remove();

		repositoryView.free();
		repositoryView.remove();
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
	},

	initRepositoryPage: function initRepositoryPage($container) {
		$container.append(repositoryView.el);
		repositoryView.delegateEvents().render();

		//init model
		repository.connect(repositoryView.getOptions());
		repository.getFiles();
	}
};
