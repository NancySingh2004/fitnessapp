const mongoose = require('mongoose');
const heartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bpm: Number,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Heart', heartSchema);
