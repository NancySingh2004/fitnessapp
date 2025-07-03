// models/NutritionPlan.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: String,
    time: String, // e.g., Breakfast, Lunch, Dinner
    items: [String], // Still simplified for prototype
    calories: Number, // Still pre-defined for prototype
    // For prototype, we might add some basic macros here if needed
    // protein: Number, carbs: Number, fat: Number
});

const nutritionPlanSchema = new mongoose.Schema({
    title: String,
    level: String,
    goal: String,
    days: [
        {
            day: String,
            meals: [mealSchema]
        }
    ],
    // Add overall plan targets for reference
    target_daily_calories: Number,
    target_daily_protein: Number,
    target_daily_carbs: Number,
    target_daily_fat: Number,
});

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);