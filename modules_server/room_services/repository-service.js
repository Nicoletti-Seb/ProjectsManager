var fs = require('fs');
var path = require('path');

/* eslint-disable vars-on-top */
exports.listen = function repositoryService(io, socket) {
	var rootDir = path.join(__dirname, '..', '..', 'repositories', '1');
	var currentDir = rootDir;


	function sendFiles() {
		fs.readdir(currentDir, function onReaddir(err, filenames) {
			if (err) {
				socket.emit('updateFiles', { error: err });
				return;
			}

			//read informations for each files
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
				.catch(function onErrorGetFiles(errGetFiles) {
					socket.emit('updateFiles', { error: errGetFiles });
				});
		});
	}


	socket.on('getFiles', sendFiles);

	socket.on('toParent', function toParent() {
		var newDir = path.join(currentDir, '..');

		if (newDir.length < rootDir.length) {
			socket.emit('updateFiles', { error: 'Access unauthorized' });
			return;
		}

		currentDir = newDir;
		sendFiles();
	});


	socket.on('toDirectory', function toDirectory(dirname) {
		if (!dirname) {
			socket.emit('updateFiles', { error: 'Invalid parameters' });
			return;
		}

		var newDir = path.join(currentDir, dirname);
		fs.access(newDir, function onAccessDir(err) {
			if (err) {
				socket.emit('updateFiles', { error: err });
				return;
			}

			currentDir = newDir;
			sendFiles();
		});
	});

	socket.on('createDirectory', function createDirectory(dirname) {
		if (!dirname) {
			socket.emit('updateFiles', { error: 'Invalid parameters' });
			return;
		}

		var newDir = path.join(currentDir, dirname);
		fs.mkdir(newDir, function mkdir(err) {
			if (err) {
				socket.emit('updateFiles', { error: err });
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
			socket.emit('updateFiles', { error: 'Invalid parameters' });
			return;
		}

		var pathDir = path.join(currentDir, dirname);
		fs.access(pathDir, function onAccessDir(err) {
			if (err) {
				socket.emit('updateFiles', { error: err });
				return;
			}

			deleteFolderSync(pathDir);
			sendFiles();
		});
	});

	socket.on('deleteFile', function deleteFile(filename) {
		if (!filename) {
			socket.emit('updateFiles', { error: 'Invalid parameters' });
			return;
		}

		var file = path.join(currentDir, filename);
		fs.unlink(file, function onDeleteFile(err) {
			if (err) {
				socket.emit('updateFiles', { error: err });
				return;
			}

			sendFiles();
		});
	});


	socket.on('rename', function rename(oldname, newname) {
		if (!oldname || !newname) {
			socket.emit('updateFiles', { error: 'Invalid parameters' });
			return;
		}

		var oldPath = path.join(currentDir, oldname);
		var newPath = path.join(currentDir, newname);

		fs.rename(oldPath, newPath, function onRename(err) {
			if (err) {
				socket.emit('updateFiles', { error: err });
				return;
			}

			sendFiles();
		});
	});
};
/* eslint-enable vars-on-top */