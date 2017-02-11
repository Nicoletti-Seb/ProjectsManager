var fs = require('fs');
var path = require('path');


exports.listen = function repositoryService(io, socket) {
	var rootDir = path.join(__dirname, '..', '..', 'repositories', '1');
	var currentDir = rootDir;


	function getfiles() {
		fs.readdir(currentDir, function onReaddir(err, filenames) {
			if (err) {
				socket.emit('updateFiles', err);
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

						resolve(Object.assign(stats, { filename: filename }));
					});
				}));
			});

			Promise.all(promises)
				.then(function onGetFiles(results) { socket.emit('updateFiles', results); })
				.catch(function onErrorGetFiles(errGetFiles) {
					socket.emit('updateFiles', errGetFiles);
				});
		});
	}


	socket.on('getFiles', getfiles);

	socket.on('toParent', function toParent() {
		var newDir = path.join(currentDir, '..');

		if (newDir.length < rootDir.length) {
			socket.emit('updateFiles', { error: 'Access unauthorized' });
			return;
		}

		currentDir = newDir;
		getfiles();
	});


	socket.on('toDirectory', function toDirectory(dirname) {
		var newDir = path.join(currentDir, dirname);
		fs.access(newDir, function onAccessDir(err) {
			if (err) {
				socket.emit('updateFiles', err);
				return;
			}

			currentDir = newDir;
			getfiles();
		});
	});
};
