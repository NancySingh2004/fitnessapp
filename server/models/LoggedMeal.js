// models/LoggedMeal.js
const mongoose = require('mongoose');

const loggedMealSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    meal_name: { type: String, required: true }, // e.g., "Oatmeal with Berries", "Chicken Salad"
    meal_time: { type: Date, default: Date.now }, // When it was logged
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    // You could add a reference to the specific meal from a NutritionPlan if user followed it
    // original_plan_meal_id: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('LoggedMeal', loggedMealSchema);