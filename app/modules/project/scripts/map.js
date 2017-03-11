var Backbone = require('backbone');

/**
 * Created by 53js-Seb on 10/10/2016.
 */

/**
 * Options
 * {
 *      markerDraggable: boolean
 *      markerClickEvent: callback
 *      markerStartDragEvent: callback
 *      markerEndDragEvent: callback
 * }
 */
/*eslint-disable no-undef*/
module.exports = Backbone.Model.extend((function ClassMap() {
	var markers = [];
	var mapApi = null;
	var opt = {};
	var el = null;

	function getMapOptions() {
		return {
			center: new google.maps.LatLng(46.8, 2.8),
			zoom: 6
		};
	}

	function addMarker(poi) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(poi.latitude, poi.longitude),
			map: mapApi,
			title: poi.name,
			draggable: opt.markerDraggable || false,
			infoWindow: new google.maps.InfoWindow({
				maxWidth: 350
			})
		});

		// Event Listener
		if (opt.markerClickEvent) {
			google.maps.event.addListener(marker, 'click', opt.markerClickEvent);
		}
		if (opt.markerStartDragEvent) {
			google.maps.event.addListener(marker, 'dragstart', opt.markerStartDragEvent);
		}
		if (opt.markerEndDragEvent) {
			google.maps.event.addListener(marker, 'dragend', opt.markerEndDragEvent);
		}

		marker.poi = poi;
		markers.push(marker);

		return marker;
	}


	function removeAllMarkers() {
		markers.forEach(function onDeleteMarker(marker) {
			marker.setMap(null);
		});

		markers = [];
	}

	function onUpdateLocationUsers(users) {
		removeAllMarkers();

		users.forEach(function onUpdateLocationUser(user) {
			addMarker(user.location);
		});
	}

	function initialize(element, options) {
		el = element;
		opt = options;
		mapApi = new google.maps.Map(el, getMapOptions());

		if (opt.socket) {
			opt.socket.on('updateLocationUsers', onUpdateLocationUsers);
		}
	}

	function updateLocation(poi) {
		if (opt.socket) {
			opt.socket.emit('updateLocation', poi);
		}
	}

	function getMarker(idPoi) {
		for(var i in markers) {
			var marker = markers[i];

			if (marker.poi.id === idPoi) {
				return marker;
			}
		}
		return null;
	}

	function removeMarker(idPoi) {
		var marker = getMarker(idPoi);

		if (!marker) {
			return false;
		}

		marker.setMap(null);
		return true;
	}

	function trigger(obj, nameEvent) {
		new google.maps.event.trigger(obj, nameEvent);
	}

	function getMyLocation() {
		if (!navigator.geolocation) {
			return Promise.reject('Geolocation not supported');
		}

		return new Promise(function onGetMyLocation(resolve) {
			navigator.geolocation.getCurrentPosition(resolve);
		});
	}

	function close() {
		if (!opt.socket) {
			return;
		}

		opt.socket.off('updateLocationUsers');
	}

	return {
		initialize: initialize,
		getMarker: getMarker,
		addMarker: addMarker,
		removeMarker: removeMarker,
		trigger: trigger,
		getMyLocation: getMyLocation,
		updateLocation: updateLocation,
		removeAllMarkers: removeAllMarkers,
		close: close
	};
})());
/*eslint-enable no-undef*/
