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

	disconnectToProject: function disconnectToProject(e) {
		e.preventDefault();

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

	onAuthenticate: function onAuthenticate() {
		this.render();
		Backbone.history.navigate('home', { trigger: true });
	},

	onConnectedToProject: function onConnectedToProject() {
		this.render();
		Backbone.history.navigate('project', { trigger: true });
	}

});
