var Backbone = require('backbone');

module.exports = Backbone.View.extend({
	template: require('../templates/header.html'),

	events: {
		'click .disconnect-project': 'disconnectToProject',
		'click .disconnect': 'disconnect'
	},

	render: function render() {
		var html = this.template.render({
			isConnected: this.model.isConnected(),
			currentProject: this.model.currentProject()
		});
		this.$el.html(html);
		return this;
	},

	disconnect: function disconnect() {
		this.model.disconnect();
		this.render();
		Backbone.history.navigate('', { trigger: true });
	},

	disconnectToProject: function disconnectToProject() {
		this.model.disconnectToProject();
		this.render();
		Backbone.history.navigate('home', { trigger: true });
	},

	getOptions: function getOptions() {
		return {
			onAuthenticate: this.onAuthenticate.bind(this),
			onConnectedToProject: this.onConnectedToProject.bind(this)
		};
	},

	onAuthenticate: function onAuthenticate(err) {
		if (err) {
			console.log(err);
			return;
		}

		this.render();
		Backbone.history.navigate('home', { trigger: true });
	},

	onConnectedToProject: function onConnectedToProject(project) {
		if (project.error) {
			console.log(project.error);
			return;
		}

		this.render();
		Backbone.history.navigate('project', { trigger: true });
	}

});
