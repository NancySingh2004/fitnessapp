const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  weight: Number,
  steps: Number,
  calories: Number,
  mood: String
});

module.exports = mongoose.model('ProgressEntry', progressEntrySchema);
