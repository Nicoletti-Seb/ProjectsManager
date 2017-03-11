var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/projectsmanager';


module.exports = (function MongodbServerClass() {
	var mongodb = null;

	function connect() {
		if (mongodb) {
			return Promise.resolve();
		}

		return new Promise(function executor(resolve, reject) {
			MongoClient.connect(url, function onConnect(err, db) {
				if (err) {
					reject(err);
					return;
				}
				mongodb = db;
				resolve();
			});
		});
	}

	function close() {
		mongodb.close();
		mongodb = null;
	}

	function addProject(project) {

	}

	function addUser(user) {

	}

	function getUsers() {
		return new Promise(function executor(resolve, reject) {
			var collection = mongodb.collection('users');
			collection.find({}).toArray(function onToArray(err, items) {
				if (err) { return reject(err); }
				return resolve(items);
			});
		});
	}

	function getUser(login, password) {
		return new Promise(function executor(resolve, reject) {
			var collection = mongodb.collection('users');
			collection.findOne({ login: login, password: password }, function onFindOne(err, items) {
				if (err) { return reject(err); }
				return resolve(items);
			});
		});
	}

	return {
		connect: connect,
		close: close,
		addProject: addProject,
		addUser: addUser,
		getUsers: getUsers,
		getUser: getUser
	};
})();
