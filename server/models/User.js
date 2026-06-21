const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  lcUsername: {
    type: String,
    default: ''
  },
  cfUsername: {
    type: String,
    default: ''
  },
  dailyGoal: {
    type: Number,
    default: 5
  },
  weeklyGoal: {
    type: Number,
    default: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);