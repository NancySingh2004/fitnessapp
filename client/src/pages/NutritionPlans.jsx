import React, { useEffect, useState } from 'react';
import '../css/NutritionPlans.css';

const userId = '60c72b1f9c8f9c001c8e0e1a'; // Replace with actual logged-in user ID

const NutritionPlans = () => {
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');
  const API_BASE = process.env.REACT_APP_API_BASE_URL;


  const fetchDailySummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/nutrition/daily-summary/${userId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDailySummary(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch daily summary:", err);
      setError("Failed to load nutrition data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const handleLogMeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    const mealData = {
      user_id: userId,
      meal_name: mealName,
      calories: parseInt(mealCalories),
      protein: parseInt(mealProtein) || 0,
      carbs: parseInt(mealCarbs) || 0,
      fat: parseInt(mealFat) || 0,
    };

    try {
      const res = await fetch(`${API_BASE}/api/nutrition/log-meal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealData),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await fetchDailySummary();
      setMealName('');
      setMealCalories('');
      setMealProtein('');
      setMealCarbs('');
      setMealFat('');
    } catch (err) {
      console.error("Log meal failed:", err);
      setError("Failed to log meal.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dailySummary) return <div className="nutrition-container">Loading nutrition data...</div>;
  if (error) return <div className="nutrition-container text-red-500">Error: {error}</div>;
  if (!dailySummary) return <div className="nutrition-container">No nutrition data available.</div>;

  const { dailyTotals, dailyTargets, remaining, loggedMeals } = dailySummary;

  const getRecommendation = () => {
    if (remaining.calories <= 0) return "You've met your calorie goal for today!";
    if (remaining.protein > 50) return "Try a high-protein snack like eggs or tofu.";
    if (remaining.carbs > 50) return "Consider fruits or whole grains.";
    if (remaining.fat > 20) return "Avocado or nuts can help.";
    return "You're on track. Keep it up!";
  };

  return (
    <div className="nutrition-container">
      <h2 className="section-title">📊 Your Daily Nutrition Dashboard</h2>

      <div className="section-card">
        <h3 className="text-xl font-semibold mb-4">Today's Summary: {dailySummary.date}</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-label">Calories</p>
            <p className="stat-value">{dailyTotals.calories} / {dailyTargets.calories}</p>
            <p className="stat-remaining">Remaining: {remaining.calories}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Protein (g)</p>
            <p className="stat-value">{dailyTotals.protein} / {dailyTargets.protein}</p>
            <p className="stat-remaining">Remaining: {remaining.protein}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Carbs (g)</p>
            <p className="stat-value">{dailyTotals.carbs} / {dailyTargets.carbs}</p>
            <p className="stat-remaining">Remaining: {remaining.carbs}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Fat (g)</p>
            <p className="stat-value">{dailyTotals.fat} / {dailyTargets.fat}</p>
            <p className="stat-remaining">Remaining: {remaining.fat}</p>
          </div>
        </div>
        <div className="tip-box mt-6">
          <p className="font-semibold">💡 Quick Tip:</p>
          <p>{getRecommendation()}</p>
        </div>
      </div>

      {/* Log Meal Form */}
      <div className="section-card">
        <h3 className="text-xl font-semibold mb-4">➕ Log a Meal</h3>
        <form onSubmit={handleLogMeal} className="space-y-4">
          <input
            type="text"
            placeholder="Meal Name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={mealCalories}
            onChange={(e) => setMealCalories(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={mealProtein}
            onChange={(e) => setMealProtein(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={mealCarbs}
            onChange={(e) => setMealCarbs(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={mealFat}
            onChange={(e) => setMealFat(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="button-submit">
            {loading ? "Logging..." : "Log Meal"}
          </button>
        </form>
      </div>

      {/* Meals List */}
      <div className="section-card">
        <h3 className="text-xl font-semibold mb-4">🍽️ Meals Logged Today</h3>
        {loggedMeals.length === 0 ? (
          <p className="text-gray-500">No meals logged yet today.</p>
        ) : (
          <ul className="meal-list">
            {loggedMeals.map((meal) => (
              <li key={meal._id}>
                <p className="meal-name">{meal.meal_name} <span className="text-sm text-gray-500">({new Date(meal.meal_time).toLocaleTimeString()})</span></p>
                <p className="meal-info">{meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NutritionPlans;
