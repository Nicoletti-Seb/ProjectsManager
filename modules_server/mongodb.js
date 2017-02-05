var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';


module.exports = (function MongodbServerClass() {
	var mongodb = null;

	function connect() {
		if(mongodb) {
			return Promise.resolve();
		}

		return new Promise(function executor(resolve, reject) {
			MongoClient.connect(url, function onConnect(err, db) {
				if(err){
					reject(err);
					return;
				}
				mongodb = db;
				resolve();
			});
		});
	}

	function close() {
		db.close();
		db = null;
	}

	function addProject(project) {

	}

	function addUser(user) {

	}

	return {
		connect: connect,
		close: close,
		addProject: addProject,
		addUser: addUser
	};
})();
