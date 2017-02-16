'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

/* eslint-disable import/no-unresolved */

//module list
var connection = require('connection');
var home = require('home');
var project = require('project');
/* eslint-enable import/no-unresolved */

var $content = $('.content');
var currentModule = null;

var MainRouter = Backbone.Router.extend({

	routes: {
		'': 'connection',
		register: 'register',
		'home(/:page)': 'home',
		'project(/:page)': 'project',
		'*all': 'connection' // Last item / First match
	},

	execute: function executeRoute(callback, args/*, name*/) {
		$content.html('');

		if (currentModule) {
			currentModule.stop();
			currentModule = null;
		}

		if (callback) callback.apply(this, args);
	},

	connection: function connectionRoute() {
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

