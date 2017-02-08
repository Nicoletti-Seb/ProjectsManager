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

var MainRouter = Backbone.Router.extend({

	routes: {
		'': 'connection',
		'home(/:page)': 'home',
		'project(/:page)': 'project',
		'*all': 'connection' // Last item / First match
	},

	execute: function executeRoute(callback, args/*, name*/) {
		$content.html('');
		if (callback) callback.apply(this, args);
	},

	connection: function connectionRoute() {
		connection.start($content);
	},

	home: function homeRoute(page) {
		home.start($content, page);
	},

	project: function projectRoute(page) {
		project.start($content, page);
	}
});

module.exports = function start() {
	return new MainRouter();
};

