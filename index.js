const port = process.env.PORT || 5432;

const express = require('express');
const bodyparser = require('body-parser');

const app = express();

const http = require('http').Server(app);
const path = require('path');
const mongo = require('mongodb').MongoClient;
const shortid = require('shortid');

let polls;

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/createPoll/createPoll.html'));
});

app.get(/^\/[A-Za-z0-9]+$/, (req, res) => {
  res.sendFile(path.join(__dirname, '/client/viewPoll/viewPoll.html'));
});

mongo.connect(String(process.env.MONGOHQ_URL), (err, db) => {
  polls = db.collection('strawpoll');
});

app.get(/^\/poll\/\w+$/, (req, res) => {
  const requestedPoll = req.url.split('/').pop();

  if (requestedPoll) {
    // Find the poll at the requested url in the database
    polls.findOne({ poll: requestedPoll }, (err, data) => {
      // If we find the poll then post back the json data for it
      if (data) {
        res.json(data);

      // Otherwise we output that we couldn't find a poll
      } else {
        res.json({ message: 'No poll found' });
      }
    });
  }
});

app.post('/save', (req, res) => {
  const pollId = shortid.generate();

  polls.findOne({ poll: pollId }, (err, data) => {
    if (!data) {
      polls.insert({
        poll: pollId,
        votes: 0,
        allowMultiVote: 'n',
        questionText: req.body.questionText,
        optionOne: req.body.optionOne,
        optionTwo: req.body.optionTwo,
        optionThree: req.body.optionThree,
      }, () => {
        console.log(`Created poll with ID of ${pollId}`);
        res.json({ poll: pollId });
      });
    }
  });
});

http.listen(port, () => {
  console.log(`Listening on: ${port}`);
});
