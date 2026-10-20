import mongoose from 'mongoose';

const ActivePollSchema = new mongoose.Schema({
  pollId: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  respondents: {
    type: Array,
    required: true,
  },
  answerSets: {
    type: Array,
    required: true,
  },
  currentQuestion: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivePoll', ActivePollSchema);
