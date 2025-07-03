const mongoose = require('mongoose');

const workoutScheduleSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  workout: { type: String, required: true }
});

module.exports = mongoose.model('WorkoutSchedule', workoutScheduleSchema);
