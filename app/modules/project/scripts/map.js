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
	var socket = null;
	var markers = [];

	function getMapOptions() {
		return {
			center: new google.maps.LatLng(46.8, 2.8),
			zoom: 6
		};
	}

	function initialize(element, options) {
		this.el = element;
		this.opt = options;
		this.mapApi = new google.maps.Map(this.el, getMapOptions());
	}


	function addMarker(poi) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(poi.latitude, poi.longitude),
			map: this.mapApi,
			title: poi.name,
			draggable: this.opt.markerDraggable || false,
			infoWindow: new google.maps.InfoWindow({
				maxWidth: 350
			})
		});

		// Event Listener
		if (this.opt.markerClickEvent) {
			google.maps.event.addListener(marker, 'click', this.opt.markerClickEvent);
		}
		if (this.opt.markerStartDragEvent) {
			google.maps.event.addListener(marker, 'dragstart', this.opt.markerStartDragEvent);
		}
		if (this.opt.markerEndDragEvent) {
			google.maps.event.addListener(marker, 'dragend', this.opt.markerEndDragEvent);
		}

		marker.poi = poi;
		markers.push(marker);

		return marker;
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
		markers.forEach(function onDeleteMarker(marker) {
			marker.setMap(null);
		});

		markers = [];
	}

	return {
		initialize: initialize,
		getMarker: getMarker,
		addMarker: addMarker,
		removeMarker: removeMarker,
		trigger: trigger,
		getMyLocation: getMyLocation,
		close: close
	};
})());
/*eslint-enable no-undef*/
