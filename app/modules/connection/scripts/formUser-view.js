var Backbone = require('backbone');


module.exports = Backbone.View.extend({
	template: require('../templates/formUser.html'),

	events: {
		'submit .form-register': 'onSubmitFormRegister'
	},

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	},

	onSubmitFormRegister: function onSubmitFormRegister(e) {
		e.preventDefault();

		var formData = new FormData(e.currentTarget);
		var login = formData.get('login');
		var email = formData.get('email');
		var password = formData.get('password');
		var speciality = formData.get('speciality');
		//var photo = formData.get('photo');
		this.model.register(login, email, password, speciality);
	},

	getOptions: function getOptions() {
		return {};
	}
});
