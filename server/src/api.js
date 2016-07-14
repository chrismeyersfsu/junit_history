
const express = require('express');
var bodyParser = require('body-parser');
// Constants
const PORT = 8080;

// App
function init(db, col) {
    const api = express();
    api.use(bodyParser.json());
    api.use(express.static('public'));
    api.use('/static', express.static('../../client'));

    api.post('/', function (req, res) {
        var record_new = {
            'identifier': req.body.identifier,
            'name': req.body.name,
            'timestamp': req.body.timestamp,
            'commits': req.body.commits,
            'test_result': req.body.test_result,
            'junit': req.body.junit,
        }
        col.findOneAndUpdate({identifier: record_new.identifier}, {$set: record_new}, {
            returnOriginal: false,
            upsert: true
        }, function(err, record) {
            if(err) {
                throw err;
            }
            console.log(record);
            res.json(record.value);
        });
    });
    api.get('/', function (req, res) {
        col.find().toArray(function(err, docs) {
            if(err) {
                throw err;
            }
            res.json(docs);
        });
    });

    api.listen(PORT);
    console.log('Running on http://localhost:' + PORT);
}
module.exports = init;
