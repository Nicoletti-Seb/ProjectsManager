var Backbone = require('backbone');

/* eslint-disable vars-on-top */
module.exports = Backbone.View.extend({
	className: 'visio',

	tagName: 'section',

	events: {
		'click .btn-stop': 'stop'
	},

	template: require('../templates/visio.html'),

	render: function render() {
		var html = this.template.render({ files: this.model.files });
		this.$el.html(html);
		return this;
	},

	getOptions: function getOptions() {
		return {
			localMediaEl: '.visio-local',
			remoteMediaEl: '.visio-remote',
			onConnected: this.onConnected.bind(this),
			onDisconnected: this.stop,
			onParticipantConnected: this.displayOtherCam.bind(this),
			onParticipantDisconnected: this.onParticipantDisconnected.bind(this)
		};
	},

	onConnected: function onConnected() {
		console.log('onConnected');
		this.displayMyLocalCam();

		if (this.model.getParticipants().size) {
			console.log('participant');
			this.displayOtherCam();
		}
	},

	onParticipantDisconnected: function onParticipantDisconnected() {
		if (!this.model.getParticipants().size) {
			this.stop();
		}
	},

	displayOtherCam: function displayOtherCam() {
		console.log('displayOtherCam');
		this.$el.find('.loader').addClass('hidden');
		this.$el.find('.btn-stop').removeClass('hidden');
		this.$el.find('.visio-content .visio-remote').addClass('larger-video');
		this.$el.find('.visio-content .visio-local').removeClass('larger-video');
		this.$el.find('.visio-content .visio-local').addClass('small-video');
	},

	displayMyLocalCam: function displayMyLocalCam() {
		console.log('displayMyLocalCam');
		this.$el.find('.btn-stop').addClass('hidden');
		this.$el.find('.visio-content .visio-remote').removeClass('larger-video');
		this.$el.find('.visio-content .visio-local').addClass('larger-video');
		this.$el.find('.visio-content .visio-local').removeClass('small-video');
	},

	stop: function stop() {
		Backbone.history.navigate('project', { trigger: true });
	}
});
/* eslint-enable vars-on-top */
