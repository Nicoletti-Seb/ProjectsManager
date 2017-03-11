var Backbone = require('backbone');
var $ = require('jquery');

module.exports = Backbone.View.extend({
	template: require('../templates/home.html'),

	events: {
		'click .panel-project': 'onClickOpenProject'
	},

	render: function render() {
		var html = this.template.render({ projects: this.model.projects });
		this.$el.html(html);
		return this;
	},

	onClickOpenProject: function onClickOpenProject(e) {
		var projectId = $(e.currentTarget).data('id');
		console.log('switch project ', projectId);
		this.model.connectToProject(projectId);
	},

	getOptions: function getOptions() {
		return {
			onUpdateProjects: this.onUpdateProjects.bind(this)
		};
	},

	onUpdateProjects: function onUpdateProjects(projects) {
		this.render();
	}
});
