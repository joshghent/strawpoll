const port = process.env.PORT || 5432;

require('dotenv').config();

const express = require('express');
const bodyparser = require('body-parser');

const app = express();

const http = require('http');

const server = http.Server(app);
const routes = require('./routes.js');
const path = require('path');
const mongoose = require('mongoose');
const bugsnag = require('bugsnag');
const shortid = require('shortid');
const schema = require('./schema.js').pollSchema;

bugsnag.register(process.env.BUGSNAG_API_KEY);

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/createPoll/createPoll.html'));
});

app.get(/^\/[A-Za-z0-9]+$/, (req, res) => {
  res.sendFile(path.join(__dirname, '/client/viewPoll/viewPoll.html'));
});

const db = mongoose.connect(String(process.env.MONGOHQ_URL));
const Poll = db.model('strawpolls', schema);

app.get(/^\/poll\/\w+$/, (req, res) => {
  const requestedPoll = req.url.split('/').pop();

  if (requestedPoll) {
    // Find the poll at the requested url in the database
    Poll.findOne({ id: requestedPoll }, (err, data) => {
      // If we find the poll then post back the json data for it
      if (data) {
        res.json(data);

      // Otherwise we output that we couldn't find a poll
      } else {
        res.sendFile(path.join(__dirname, 'client/404.html'));
      }
    });
  }
});

app.post('/save', (req, saveRes) => {
  const pollId = shortid.generate();

  const pollObj = {
    id: pollId,
    question: req.body.question,
    options: req.body.options,
  };

  const poll = new Poll(pollObj);

  poll.save((err, res) => {
    if (err) {
      bugsnag.notify(new Error(`Error whilst saving ${pollId} - ${saveRes}`));
    } else {
      saveRes.json(res);
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/404.html'));
});

server.listen(port, () => {
  console.log(`Listening on: ${port}`);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', routes.vote);

