var express = require('express');
var app = express();
var http = require('http').Server(app)
var port = process.env.PORT || 5432;
var shortid = require('shortid');
var mongod = require('mongodb').MongoClient;
var path = require('path');
var api = require('/api.js');

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/createPoll/createPoll.html');
});

api(app);

http.listen(port, function () {
    console.log("Listening on: " + port);
});