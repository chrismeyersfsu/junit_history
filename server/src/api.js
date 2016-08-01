const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const passport = require('passport');
 
const PORT = 8080;

// App
function init(db, col) {
    var parser = new xml2js.Parser({
        'attrkey': '__',
    });

    const api = express();
    api.use(bodyParser({limit: '50mb'}));
    //api.use(express.static('public'));
    //api.use('/static', express.static('../../client'));
    var path = require("path");
    console.log("./ = %s", path.resolve("./"));
    console.log("__dirname = %s", path.resolve(__dirname));
    api.use('/static', express.static('../client'));

    api.post('/', 
        passport.authenticate('digest', { session: false }),
        function (req, res) {
        var record_new = {
            'identifier': req.body.identifier,
            'name': req.body.name,
            'timestamp': req.body.timestamp,
            'url': req.body.url,
            'commits': req.body.commits,
            'test_result': req.body.test_result,
            'meta_data': req.body.meta_data,
            'junit': req.body.junit,
        }

        parser.parseString(record_new.junit, function (err, result) {
            record_new['junit'] = result;
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
    });
    api.get('/', 
        passport.authenticate('digest', { session: false }),
        function (req, res) {
        var search = {};
        if (req.param('name')) {
            search['name'] = req.param('name');
        }
        col.find(search).toArray(function(err, docs) {
            if(err) {
                throw err;
            }
            res.json(docs);
        });
    });
    api.get('/names/', 
        passport.authenticate('digest', { session: false }),
        function (req, res) {
        //col.find({}, { 'name': 1 }).toArray(function(err, docs) {
        col.distinct('name', {}, function(err, docs) {
            if(err) {
                throw err;
            }
            res.json(docs);
        });
    });

    api.listen(PORT);
    console.log('Running on http://0.0.0.0:' + PORT);
}
module.exports = init;
