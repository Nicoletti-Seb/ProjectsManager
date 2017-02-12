var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	template: require('../templates/repository.html'),

	events: {
		'click .directory': 'onClickEnter',
		'click .previous': 'onClickPrevious'
	},

	render: function render() {
		var html = this.template.render({ files: this.model.files });
		this.$el.html(html);
		return this;
	},

	onClickEnter: function onClickEnter(e) {
		this.model.toDirectory($(e.currentTarget).data('dirname'));
	},

	onClickPrevious: function onClickPrevious() {
		this.model.toParent();
	},

	getOptions: function getOptions() {
		return {
			onUpdateFiles: this.onUpdateFiles.bind(this)
		};
	},

	onError: function onError(err) {
		console.log('onError ', err);
	},

	onUpdateFiles: function onUpdateFiles(files) {
		if (files.error) {
			console.log(files.error);
			return;
		}

		this.render();
	}
});
