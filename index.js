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
const io = require('socket.io').listen(server);
const schema = require('./schema.js').pollSchema;

app.set('socketio', io);

bugsnag.register(process.env.BUGSNAG_API_KEY);

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/createPoll/createPoll.html'));
});

app.get(/^\/[A-Za-z0-9]+\/?$/, (req, res) => {
  res.sendFile(path.join(__dirname, '/client/viewPoll/viewPoll.html'));
});

app.get(/^\/[A-Za-z0-9]+\/results$/, (req, res) => {
  res.sendFile(path.join(__dirname, '/client/results/results.html'));
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

  pollObj.options = pollObj.options.filter((e) => { return e === 0 || e; });

  if (pollObj.question === '') {
    saveRes.json({
      'status' : 'error',
      'results' : 'Please enter a question to ask.',
    });
  } else if (pollObj.length < 2) {
    saveRes.json({
      'status' : 'error',
      'results' : 'Please put at least 2 options.',
    });
  } else {
    const poll = new Poll(pollObj);

    poll.save((err, res) => {
      if (err) {
        bugsnag.notify(new Error(`Error whilst saving ${pollId} - ${saveRes}`));
      } else {
        res.status = 'success';
        saveRes.json(res);
      }
    });
  }
});

// Route to vote
app.put(/^\/poll\/\w+$/, (req, res) => {
  const requestedPoll = req.url.split('/').pop();
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  Poll.findOne({ id: requestedPoll }, (err, record) => {
    if (err) {
      bugsnag.notify(new Error(`Error whilst retrieving ${requestedPoll} - ${req.body.optionId}`));
    } else {
      const selectedOption = record.options.id(req.body.optionId);

      selectedOption.votes.push({
        ip: ipAddress,
      });

      const numberOfVotes = selectedOption.votes.length;
      const totalVotes = record.options.reduce((a, b) => { 
        return a + b.votes.length;
      }, 0);

      record.save((_err, _res) => {
        if (_err) {
          bugsnag.notify(new Error(`Error whilst saving vote ${requestedPoll} - ${req.body.optionId}`));
        } else {
          const sio = req.app.get('socketio');
          sio.emit('vote', {
            id: req.body.optionId,
            votes: numberOfVotes,
            totalVotes: totalVotes,
          });
          res.json({ message: 'Voted successfully' });
        }
      });
    }
  });
});

app.get(/^\/poll\/[A-Za-z0-9]+\/results$/, (req, res) => {
  const requestedPoll = req.url.split('/')[2];

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/404.html'));
});

server.listen(port, () => {
  console.log(`Listening on: ${port}`);
});

