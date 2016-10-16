const mongo = require('mongodb').MongoClient;
const shortid = require('shortid');

let polls;

module.exports = (app) => {
  mongo.connect(String(process.env.MONGOHQ_URL), (err, db) => {
    polls = db.collection('strawpoll');
  });

  // Urls to polls will always be something like 'strawpoll.joshghent.com/poll/<RANDOM 8 CHAR STRING>'
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
          res.json({ message: "No poll found" });
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
        });
      }
    });
  });
};
