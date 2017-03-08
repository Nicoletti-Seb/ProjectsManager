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
        db.close();
        db = null;
    }

    function addProject(project) {

    }

    function addUser(user) {

    }

    function getUsers(callback) {
        return new Promise(function executor(resolve, reject) {
            var collection = db.collection('users');
            collection.find({}).toArray(reject, resolve);
        });
    }

    function getUser(login, password) {
        return new Promise(function executor(resolve, reject) {
            var collection = db.collection('users');
            collection.find({ 'login':login, 'password':password}).toArray(reject, resolve);
        });
    }

    return {
        connect: connect,
        close: close,
        addProject: addProject,
        addUser: addUser
        getUsers: getUsers,
        getUser: getUser
    };
})();