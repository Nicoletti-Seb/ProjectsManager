
var Backbone = require('backbone');


module.exports = Backbone.View.extend({
	template: require('../templates/connection.html'),

	events: {
		'submit .form-connection': 'onSubmitFormConnection'
	},

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	},


	onSubmitFormConnection: function onSubmitFormConnection(e) {
		e.preventDefault();

		var formData = new FormData(e.currentTarget);
		var login = formData.get('login');
		var password = formData.get('password');
		this.model.authentication(login, password);
	},

	getOptions: function getOptions() {
		return {
			onAuthenticate: this.onAuthenticate.bind(this)
		};
	},

	onAuthenticate: function onAuthenticate(err) {
		if (err) {
			console.log(err);
			return;
		}

		console.log('Connected');
	}
});
