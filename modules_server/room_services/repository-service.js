var fs = require('fs-extra');
var path = require('path');
var ss = require('socket.io-stream');

/* eslint-disable vars-on-top */
module.exports = function RepositoryService(io, socket) {
	var rootDir = '';
	var currentDir = '';

	(function update() {
		if (!socket.currentProject) {
			return;
		}

		rootDir = path.join(__dirname, '..', '..', 'repositories',
			String(socket.currentProject._id.str));
		currentDir = rootDir;

		if (!fs.existsSync(rootDir)) {
			fs.mkdirSync(rootDir);
		}
	})();

	function sendFiles() {
		fs.readdir(currentDir, function onReaddir(err, filenames) {
			if (err) {
				socket.emit('msgError', 'une erreur c\'est produite...');
				return;
			}

			//read informations for each files;

			var promises = [];
			filenames.forEach(function getStatFiles(filename) {
				promises.push(new Promise(function getStat(resolve, reject) {
					fs.stat(path.join(currentDir, filename), function onReadStat(errReadStat, stats) {
						if (errReadStat) {
							reject(err);
							return;
						}

						resolve(Object.assign(stats, { filename: filename, isDirectory: stats.isDirectory() }));
					});
				}));
			});

			Promise.all(promises)
				.then(function onGetFiles(results) { socket.emit('updateFiles', results); })
				.catch(function onErrorGetFiles(/*errGetFiles*/) {
					socket.emit('msgError', 'une erreur c\'est produite...');
				});
		});
	}

	socket.on('getFiles', function onGetFiles() {
		sendFiles();
	});

	socket.on('toParent', function toParent() {
		var newDir = path.join(currentDir, '..');

		if (newDir.length < rootDir.length) {
			socket.emit('message', 'Action impossible...');
			return;
		}

		currentDir = newDir;
		sendFiles();
	});


	socket.on('toDirectory', function toDirectory(dirname) {
		if (!dirname) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var newDir = path.join(currentDir, dirname);
		fs.access(newDir, function onAccessDir(err) {
			if (err) {
				socket.emit('updateFiles', 'Le dossier n\'existe pas...');
				sendFiles();
				return;
			}

			currentDir = newDir;
			sendFiles();
		});
	});

	socket.on('createDirectory', function createDirectory(dirname) {
		if (!dirname) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var newDir = path.join(currentDir, dirname);
		fs.mkdir(newDir, function mkdir(err) {
			if (err) {
				socket.emit('msgError', 'Un dossier du même nom existe déjà...');
				sendFiles();
				return;
			}

			sendFiles();
		});
	});


	function deleteFolderSync(pathFolder) {
		fs.readdirSync(pathFolder).forEach(function loopFiles(filename) {
			var newPath = path.join(pathFolder, filename);
			var stats = fs.statSync(newPath);

			if (stats.isDirectory()) {
				deleteFolderSync(newPath);
			} else {
				fs.unlinkSync(newPath);
			}
		});

		fs.rmdirSync(pathFolder);
	}

	socket.on('deleteDirectory', function deleteDirectory(dirname) {
		if (!dirname) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var pathDir = path.join(currentDir, dirname);
		fs.access(pathDir, function onAccessDir(err) {
			if (err) {
				socket.emit('msgError', 'Le dossier n\'existe pas....');
				sendFiles();
				return;
			}

			deleteFolderSync(pathDir);
			sendFiles();
		});
	});

	socket.on('deleteFile', function deleteFile(filename) {
		if (!filename) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var file = path.join(currentDir, filename);
		fs.unlink(file, function onDeleteFile(err) {
			if (err) {
				socket.emit('msgError', 'Le fichier n\'existe pas....');
				sendFiles();
				return;
			}

			sendFiles();
		});
	});


	socket.on('rename', function rename(oldname, newname) {
		if (!oldname || !newname) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var oldPath = path.join(currentDir, oldname);
		var newPath = path.join(currentDir, newname);

		fs.rename(oldPath, newPath, function onRename(err) {
			if (err) {
				socket.emit('msgError', 'Un fichier ou un dossier du même nom existe déjà...');
				sendFiles();
				return;
			}

			sendFiles();
		});
	});

	ss(socket).on('download', function onDownload(stream, filename) {
		if (!filename) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var pathFile = path.join(currentDir, filename);
		fs.access(pathFile, function onAccessDir(err) {
			if (err) {
				socket.emit('msgError', 'Le fichier n\'existe pas....');
				sendFiles();
				return;
			}

			fs.createReadStream(pathFile).pipe(stream);
		});
	});

	ss(socket).on('upload', function onUpload(stream, filename) {
		if (!filename) {
			socket.emit('msgError', 'Paramètre invalide...');
			return;
		}

		var pathFile = path.join(currentDir, filename);
		fs.access(pathFile, function onAccessDir(err) {
			if (!err) {
				socket.emit('message', 'Le fichier existe déjà...');
				sendFiles();
				return;
			}

			stream.on('end', function onEnd() {
				sendFiles();
			});

			stream.pipe(fs.createWriteStream(pathFile));
		});
	});

	function close() {
		socket.removeAllListeners('getFiles');
		socket.removeAllListeners('toParent');
		socket.removeAllListeners('toDirectory');
		socket.removeAllListeners('createDirectory');
		socket.removeAllListeners('deleteDirectory');
		socket.removeAllListeners('deleteFile');
		socket.removeAllListeners('rename');
		ss(socket).removeAllListeners('download');
		ss(socket).removeAllListeners('upload');
	}

	return {
		close: close
	};
};
/* eslint-enable vars-on-top */
