var Backbone = require('backbone');

/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {

		onError: function (err)
		onConnect: function ()
		updateFiles: function (files)
	}
*/
module.exports = Backbone.Model.extend((function RepositoryClass() {
	var socket = null;
	var files = [];
	var options = {};

	function onUpdateFiles(newfiles) {
		if (!newfiles.error) {
			files.splice(0, files.length);
			Array.prototype.push.apply(files, newfiles);
		}

		if (options.onUpdateFiles) {
			options.onUpdateFiles(newfiles);
		}
	}

	function connect(opt) {
		options = opt;
		socket = require('socket.io-client')();
		socket.on('error', options.onError);
		socket.on('updateFiles', onUpdateFiles);
	}

	function getFiles() {
		if (!socket) {
			return;
		}

		socket.emit('getFiles');
	}

	function toParent() {
		if (!socket) {
			return;
		}

		socket.emit('toParent');
	}

	function toDirectory(dirname) {
		if (!socket) {
			return;
		}

		socket.emit('toDirectory', dirname);
	}

	function createDirectory(dirname) {
		if (!socket) {
			return;
		}

		socket.emit('createDirectory', dirname);
	}

	function stop() {
		if (!socket) {
			return;
		}

		socket.stop();
		socket = null;
	}

	return {
		connect: connect,
		getFiles: getFiles,
		toParent: toParent,
		toDirectory: toDirectory,
		createDirectory: createDirectory,
		files: files,
		stop: stop
	};
})());
