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
	map = new Map(mapView.el.querySelector('.map'), {});
	mapView.model = map;

	map.getMyLocation()
		.then(function onGetMyLocation(position) {
			map.addMarker(position.coords);
		}).catch(function errorOnGetMyLocation(err) {
			console.log(err);
		});
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

		if (map) {
			map.close();
		}

		//View
		console.log(mapView);
		mapView.remove();
		roomView.remove();
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
