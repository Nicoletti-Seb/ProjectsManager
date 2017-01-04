'use strict';
var callbacks = [];

function onreadystatechange() {
	if (document.readyState === 'complete') {
		callbacks.forEach(function each(callback) {
			callback();
		});
		callbacks.length = 0;
	}
}

document.addEventListener('readystatechange', onreadystatechange);

function domReady(callback) {
	if (document.readyState === 'complete') {
		callback();
	} else {
		callbacks.push(callback);
	}
}

module.exports = domReady;
