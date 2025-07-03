const express = require('express');
const router = express.Router();
const NutritionPlan = require('../models/NutritionPlan');
const LoggedMeal = require('../models/LoggedMeal'); // New model
// Assuming you have a User model for user_id reference
// const User = require('../models/User');

// --- Existing Route: Get all nutrition plans (for display) ---
router.get('/', async (req, res) => {
    try {
        const plans = await NutritionPlan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- NEW Route: Log a meal for a user ---
router.post('/log-meal', async (req, res) => {
    const { user_id, meal_name, calories, protein, carbs, fat, meal_time } = req.body;

    // Basic validation for prototype
    if (!user_id || !meal_name || calories === undefined) {
        return res.status(400).json({ message: 'Missing required meal data.' });
    }

    try {
        const newLoggedMeal = new LoggedMeal({
            user_id,
            meal_name,
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            meal_time: meal_time ? new Date(meal_time) : Date.now()
        });
        await newLoggedMeal.save();
        res.status(201).json(newLoggedMeal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- NEW Route: Get daily nutrition summary for a user ---
router.get('/daily-summary/:userId', async (req, res) => {
    const userId = req.params.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    try {
        const loggedMeals = await LoggedMeal.find({
            user_id: userId,
            meal_time: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // Calculate totals
        const totalCalories = loggedMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const totalProtein = loggedMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const totalCarbs = loggedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        const totalFat = loggedMeals.reduce((sum, meal) => sum + meal.fat, 0);

        // For prototype, let's assume a static target or fetch from user's active plan
        // In a real app, you'd fetch the user's chosen plan's daily targets here
        // For simplicity, let's hardcode for prototype or fetch a default plan
        const targetCalories = 2000; // Example target
        const targetProtein = 150;
        const targetCarbs = 200;
        const targetFat = 70;

        res.json({
            userId,
            date: today.toISOString().split('T')[0], // YYYY-MM-DD
            loggedMeals,
            dailyTotals: {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            },
            dailyTargets: {
                calories: targetCalories,
                protein: targetProtein,
                carbs: targetCarbs,
                fat: targetFat
            },
            remaining: {
                calories: targetCalories - totalCalories,
                protein: targetProtein - totalProtein,
                carbs: targetCarbs - totalCarbs,
                fat: targetFat - totalFat
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;