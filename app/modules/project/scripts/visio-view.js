var $ = require('jquery');
var Backbone = require('backbone');

/* eslint-disable vars-on-top */
module.exports = Backbone.View.extend({

	template: require('../templates/visio.html'),

	events: {},

	render: function render() {
		var html = this.template.render({ files: this.model.files });
		this.$el.html(html);
		return this;
	},

	
	getOptions: function getOptions() {
		return {};
	}
	
});
/* eslint-enable vars-on-top */
