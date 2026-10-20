import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  userId: {
    type: String,
    required: true,
    max: 255,
    min: 8,
  },
  pollPin: {
    type: Number,
    required: true,
    max: 999999,
    min: 100000,
  },
  active: {
    type: Boolean,
    required: true,
  },
  archived: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  questions: {
    type: Array,
    required: true,
  },
  result: {
    type: Array,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Poll', pollSchema);
