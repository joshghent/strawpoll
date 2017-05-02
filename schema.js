const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({ ip: 'String' });

const optionsSchema = new mongoose.Schema({ text: String, votes: [voteSchema] });

exports.pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [optionsSchema],
  id: String,
});
