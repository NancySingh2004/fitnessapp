const mongoose = require('mongoose');

const activityRingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  move: Number,     // in minutes
  exercise: Number, // number of workouts
  stand: Number     // number of standing hours
});

module.exports = mongoose.model('ActivityRing', activityRingSchema);
