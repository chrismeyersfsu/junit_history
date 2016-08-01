var MongoClient = require('mongodb').MongoClient;
var _shutdown = require('./shutdown.js');
var _api_auth = require('./api_auth.js');
var _api = require('./api.js');

var url = 'mongodb://mongo:27017/myproject';
// Use connect method to connect to the Server
var db = MongoClient.connect(url, function(err, db) {
    if(err) {
        throw err;
    }
    var shutdown = _shutdown(db);
    var col = db.collection('junit_records');
    var col_users = db.collection('users');
    var api_auth = _api_auth(db, col_users);
    var api = _api(db, col);
    console.log("connected to the mongoDB !");
});

