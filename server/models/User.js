const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  goal: String,
  joinedAt: { type: Date, default: Date.now },
    progress: [
    {
      date: String,       // e.g., '2025-07-01'
      workoutId: String,  // optional: to link specific workouts
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
