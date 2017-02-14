var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	template: require('../templates/repository.html'),

	events: {
		'click .directory.enter': 'onClickEnter',
		'click .previous': 'onClickPrevious',
		'click .create-directory': 'onClickCreateDirectory',
		'click .directory.delete': 'onClickDeleteDirectory',
		'click .file.delete': 'onClickDeleteFile',
		'click .edit': 'onClickRename',
		'dblclick .file.download': 'onDblClickDownload'
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

	onClickCreateDirectory: function onClickCreateDirectory() {
		this.model.createDirectory(prompt('Entrer le nom du nouveau dossier: ', 'Nouveau Dossier'));
	},

	onClickDeleteDirectory: function onClickDeleteDirectory(e) {
		this.model.deleteDirectory($(e.currentTarget).data('dirname'));
	},

	onClickDeleteFile: function onClickDeleteFile(e) {
		this.model.deleteFile($(e.currentTarget).data('filename'));
	},

	onClickRename: function onClickRename(e) {
		var name = $(e.currentTarget).data('name');
		this.model.rename(name, prompt('Entrer le nouveau nom: ', name));
	},

	onDblClickDownload: function onDblClickDownload(e) {
		this.model.download($(e.currentTarget).data('filename'));
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
