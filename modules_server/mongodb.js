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
        var findDocuments = function(db, callback) {
            // Get the documents collection
            var collection = db.collection('users');
            // Find some documents
            collection.find({}).toArray(function(err, docs) {
                console.log("Found the following records");
                console.log(docs)
                callback(err, docs);
            });
        }

        return findDocuments;
    }

    return {
        connect: connect,
        close: close,
        addProject: addProject,
        addUser: addUser,
        getUsers: getUsers
    };
})();