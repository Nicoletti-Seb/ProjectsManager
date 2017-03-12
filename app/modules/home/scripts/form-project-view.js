var Backbone = require('backbone');


module.exports = Backbone.View.extend({
	template: require('../templates/formProject.html'),

	events: {
		'submit .form-createProject': 'onSubmitFormCreateProject'
	},

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	},

	onSubmitFormCreateProject: function onSubmitFormCreateProject(e) {
		e.preventDefault();

		var formData = new FormData(e.currentTarget);
		var title = formData.get('title');
		var desc = formData.get('desc');
		var members = formData.get('members');
		this.model.createProject(title, desc, members);

		// redirect home page
		Backbone.history.navigate('home', { trigger: true });
	},

	getOptions: function getOptions() {
		return {};
	}
});
