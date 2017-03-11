var Backbone = require('backbone');

module.exports = Backbone.View.extend({
	template: require('../templates/notification.html'),

	events: {
		'click .close': 'close'
	},

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	},

	close: function close() {
		this.$el.addClass('hidden');
	},

	getOptions: function getOptions() {
		return {
			onMessage: this.onMessage.bind(this),
			onError: this.onError.bind(this)
		};
	},

	displayMessage: function getOptions() {
		this.$el.removeClass('hidden');
		setTimeout(function onRemove() { this.close(); }.bind(this), 5000);
	},

	onMessage: function onMessage(msg) {
		this.$el.removeClass('error');
		this.$el.find('.title').text('Message');
		this.$el.find('.body').text(msg);
		this.displayMessage();
	},

	onError: function onError(err) {
		this.$el.addClass('error');
		this.$el.find('.title').text('Erreur');
		this.$el.find('.body').text(err);
		this.displayMessage();
	}

});
