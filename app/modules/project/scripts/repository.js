var Backbone = require('backbone');
var ss = require('socket.io-stream');
/*
	Ref: https://www.npmjs.com/package/socket.io-client

	Options = {

		onError: function (err)
		onConnect: function ()
		updateFiles: function (files)
	}
*/
/* eslint-disable vars-on-top */
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

	function init(session, opt) {
		socket = session;
		options = opt;
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

	function deleteDirectory(dirname) {
		if (!socket) {
			return;
		}

		socket.emit('deleteDirectory', dirname);
	}

	function deleteFile(filename) {
		if (!socket) {
			return;
		}

		socket.emit('deleteFile', filename);
	}

	function rename(oldname, newname) {
		if (!socket) {
			return;
		}

		socket.emit('rename', oldname, newname);
	}


	//Ref : http://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
	var saveData = (function createSaveData() {
		var a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';

		return function SaveDataFunction(data, filename) {
			var blob = new Blob(data);
			var url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
		};
	}());

	function download(filename) {
		if (!socket) {
			return;
		}

		var fileBuffer = [];
		var stream = ss.createStream();
		stream.on('data', function onData(chunk) {
			fileBuffer.push(chunk);
		});

		stream.on('end', function onEnd() {
			saveData(fileBuffer, filename);
		});

		ss(socket).emit('download', stream, filename);
	}

	function upload(file) {
		if (!socket) {
			return;
		}

		var stream = ss.createStream();

		ss(socket).emit('upload', stream, file.name);
		ss.createBlobReadStream(file).pipe(stream);
	}

	return {
		init: init,
		getFiles: getFiles,
		toParent: toParent,
		toDirectory: toDirectory,
		createDirectory: createDirectory,
		deleteDirectory: deleteDirectory,
		deleteFile: deleteFile,
		files: files,
		rename: rename,
		download: download,
		upload: upload
	};
})());
/* eslint-enable vars-on-top */
