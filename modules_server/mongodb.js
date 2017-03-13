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

	function addProjectOne(idProject, login) {
		return new Promise(function executor(resolve, reject) {
			var colUsers = mongodb.collection('users');
			colUsers.updateOne(
				{ login: login },
				{ $push: { projects: idProject } },
				function onUpdateOne(err, items) {
					if (err) { return reject(err); }
					return resolve(items);
			});
		});
	}

	function addProjectMany(idProject, members) {
		var promises = [];

		members.forEach(function onMembers(m) {
			promises.push(addProjectOne(idProject, m));
		});

		return Promise.all(promises);
	}

	function createProject(title, desc, members, idLeader) {
		return new Promise(function executor(resolve, reject) {
			var colProjects = mongodb.collection('projects');
			colProjects.insertOne(
				{ name: title, desc: desc, leader: idLeader, currentUsers: [] },
				function onFindOne(err, items) {
					if (err) { return reject(err); }
					var idProject = items.ops[0]._id;
					return addProjectMany(idProject, members).then(function () { return resolve(items); });
				});
		});
	}

	function addUser(login, password, firstname, lastname, email, speciality) {
		return new Promise(function executor(resolve, reject) {
			var collection = mongodb.collection('users');
			collection.insertOne(
				{ login: login, password: password,
					firstname: firstname, lastname: lastname,
					email: email, speciality: speciality,
					projects: [] }
					, function onFindOne(err, items) {
				if (err) { return reject(err); }
				return resolve(items);
			});
		});
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

	function getProjects() {
		return new Promise(function executor(resolve, reject) {
			var collection = mongodb.collection('projects');
			collection.find({}).toArray(function onToArray(err, items) {
				if (err) { return reject(err); }
				return resolve(items);
			});
		});
	}

	function getProject(id) {
		return new Promise(function executor(resolve, reject) {
			var collection = mongodb.collection('projects');
			collection.findOne({ id: id }, function onFindOne(err, items) {
				if (err) { return reject(err); }
				return resolve(items);
			});
		});
	}

	return {
		connect: connect,
		close: close,
		createProject: createProject,
		addUser: addUser,
		getUsers: getUsers,
		getUser: getUser,
		getProjects: getProjects,
		getProject: getProject
	};
})();
