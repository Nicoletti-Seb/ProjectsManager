
var Backbone = require('backbone');


module.exports = Backbone.View.extend({
	template: require('../templates/home.html'),

	render: function render() {
		this.$el.html(this.template);
		return this;
	}
});
