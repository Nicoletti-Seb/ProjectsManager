'use strict';

var $ = require('jquery');
var Backbone = require('backbone');


$(function onDocumentReady() {
	//Start router
	require('./routers/main-routers')();
	Backbone.history.start();
});
