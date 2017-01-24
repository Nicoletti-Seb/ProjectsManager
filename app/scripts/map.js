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
module.exports = (function ClassMap() {
	var markers = [];

	var MapObject = function MapObject(element, options) {
		this.el = element;
		this.opt = options;
		this.mapApi = new google.maps.Map(this.el, getMapOptions());
	};

	function getMapOptions() {
		return {
			center: new google.maps.LatLng(46.8, 2.8),
			zoom: 6
		};
	}

	function addMarker(poi) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(poi.y, poi.x),
			map: this.mapApi,
			title: poi.name,
			draggable: this.opt.markerDraggable || false,
			infoWindow: new google.maps.InfoWindow({
				maxWidth: 350
			})
		});

		// Event Listener
		if (this.opt.markerClickEvent)
			google.maps.event.addListener(marker, 'click', this.opt.markerClickEvent);
		if (this.opt.markerStartDragEvent)
			google.maps.event.addListener(marker, 'dragstart', this.opt.markerStartDragEvent);
		if (this.opt.markerEndDragEvent)
			google.maps.event.addListener(marker, 'dragend', this.opt.markerEndDragEvent);

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

	MapObject.prototype = {
		getMarker: getMarker,
		addMarker: addMarker,
		removeMarker: removeMarker,
		trigger: trigger
	};

	return MapObject;
})();
/*eslint-enable no-undef*/ 
