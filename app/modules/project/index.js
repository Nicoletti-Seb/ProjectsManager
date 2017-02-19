'use strict';

var Map = require('./scripts/map');
var Room = require('./scripts/room');
var Repository = require('./scripts/repository');

var MapView = require('./scripts/map-view');
var RoomView = require('./scripts/room-view');
var RepositoryView = require('./scripts/repository-view');


//Model
var socket = null;
var map = null;
var room = new Room();
var repository = new Repository();

//Views
var mapView = new MapView({ model: map });
var roomView = new RoomView({ model: room });
var repositoryView = new RepositoryView({ model: repository });


//Loading async map
window.onLoadMap = function onLoadMap() {
	map = new Map(mapView.el.querySelector('.map'), { socket: socket, markerDraggable: true });
	mapView.model = map;

	map.getMyLocation()
		.then(function onGetMyLocation(position) {
			map.addMarker(position.coords);
			map.updateLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		}).catch(function errorOnGetMyLocation(err) {
			console.log(err);
		});
};

module.exports = function main(session) {
	socket = session;

	return {
		start: function startProject($container, page) {
			console.log('start index project');
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
			if (map) {
				map.removeAllMarkers();
				map.close();
			}

			room.close();
			repository.close();

			//View
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
			room.init(socket, roomView.getOptions());
		},

		initRepositoryPage: function initRepositoryPage($container) {
			$container.append(repositoryView.el);
			repositoryView.delegateEvents().render();

			//init model
			repository.init(socket, repositoryView.getOptions());
			repository.getFiles();
		}
	};
};
