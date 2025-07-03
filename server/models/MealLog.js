const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: String,
  meals: [
    {
      type: String,
      items: [String],
      calories: Number
    }
  ]
});


module.exports = mongoose.model('MealLog', mealLogSchema);
