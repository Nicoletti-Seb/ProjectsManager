'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

/*eslint-disable vars-on-top*/
var socket = require('socket.io-client')();

/* eslint-disable import/no-unresolved */
var connection = require('connection')(socket);
var home = require('home')(socket);
var project = require('project')(socket);
var header = require('header')(socket);
/* eslint-enable import/no-unresolved */

var $content = $('.content');
var currentModule = null;

var $header = $('.header');
header.start($header);

function onDisconnect() {
	console.log('onDisconnect');
	socket = require('socket.io-client')();
	connection.setSocket(socket);
	home.setSocket(socket);
	project.setSocket(socket);
	header.setSocket(socket);

	socket.once('disconnect', onDisconnect);
}
socket.once('disconnect', onDisconnect);


console.log(socket);
var MainRouter = Backbone.Router.extend({
	routes: {
		'': 'connection',
		register: 'register',
		'home(/:page)': 'home',
		'project(/:page)': 'project',
		'*all': 'connection' // Last item / First match
	},

	execute: function executeRoute(callback, args/*, name*/) {
		console.log('execute router');
		$content.html('');

		if (currentModule) {
			currentModule.stop();
			currentModule = null;
		}

		if (callback) callback.apply(this, args);
	},

	connection: function connectionRoute() {
		console.log('execute connection');
		currentModule = connection;
		connection.start($content);
	},

	register: function registerRoute() {
		currentModule = connection;
		connection.start($content, 'register');
	},

	home: function homeRoute(page) {
		currentModule = home;
		home.start($content, page);
	},

	project: function projectRoute(page) {
		currentModule = project;
		project.start($content, page);
	}
});

module.exports = function start() {
	return new MainRouter();
};
/*eslint-enable vars-on-top*/
