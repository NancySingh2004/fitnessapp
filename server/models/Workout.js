const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  reps: String,
  videoURL: String,
});

const workoutSchema = new mongoose.Schema({
  title: String,
  level: String, // beginner, intermediate, advanced
  type: String, // strength, cardio, etc.
  duration: Number, // in minutes
  description: String,
  exercises: [exerciseSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workout', workoutSchema);
