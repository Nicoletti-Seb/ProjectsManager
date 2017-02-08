var Backbone = require('backbone');


module.exports = Backbone.View.extend({
	template: require('../templates/formProject.html'),

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	}
});
