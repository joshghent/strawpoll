const port = process.env.PORT || 5432;

const express = require('express');
const bodyparser = require('body-parser');

const app = express();

const http = require('http').Server(app);
const path = require('path');
const api = require('./api');

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/createPoll/createPoll.html'));
});

api(app);

http.listen(port, () => {
  console.log("Listening on: " + port);
});