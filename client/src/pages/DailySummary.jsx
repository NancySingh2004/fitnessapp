import React, { useEffect, useState } from 'react';
import '../css/Summary.css';

const DailySummary = () => {
  const [mealLogs, setMealLogs] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchMeals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/meallog', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const todayMeals = data.logs.find(log => log.date === today);
        setMealLogs(todayMeals?.meals || []);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    const fetchWorkouts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const todayWorkout = data.progress.find(p => p.date === today);
        setWorkouts(todayWorkout ? [todayWorkout] : []);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchMeals();
    fetchWorkouts();
  }, []);

  const totalCaloriesEaten = mealLogs.reduce((sum, meal) => sum + meal.calories, 0);
  const totalCaloriesBurned = workouts.length * 200; // example assumption
  const netCalories = totalCaloriesEaten - totalCaloriesBurned;

  return (
    <div className="summary-container">
      <h2 className="summary-header">📈 Daily Health Summary</h2>

      <section className="summary-section">
        <div className="summary-card">
          <h3 className="card-title">🍽️ Total Calories Eaten</h3>
          <p className="card-value">{totalCaloriesEaten} kcal</p>
          <p className="card-detail">Based on all meals logged today</p>
        </div>

        <div className="summary-card">
          <h3 className="card-title">🏋️ Calories Burned</h3>
          <p className="card-value">{totalCaloriesBurned} kcal</p>
          <p className="card-detail">Assumed 200 kcal per workout session</p>
        </div>

        <div className={`summary-card ${netCalories >= 0 ? 'surplus' : 'deficit'}`}>
          <h3 className="card-title">⚖️ Net Calories</h3>
          <p className="card-value">
            {netCalories >= 0
              ? `+${netCalories} kcal (Surplus)`
              : `${netCalories} kcal (Deficit)`}
          </p>
          <p className="card-detail">
            {netCalories >= 0
              ? 'You consumed more than you burned today.'
              : 'Great! You maintained a calorie deficit.'}
          </p>
        </div>
      </section>

      <section className="log-section">
        <h3 className="log-title">📋 Meals Logged</h3>
        {mealLogs.length === 0 ? (
          <p className="log-empty">No meals logged today.</p>
        ) : (
          <ul className="log-list">
            {mealLogs.map((meal, i) => (
              <li key={i} className="log-item">
                <span>{meal.name}</span>
                <span>{meal.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="log-title mt-4">💪 Workouts Completed</h3>
        {workouts.length === 0 ? (
          <p className="log-empty">No workouts logged today.</p>
        ) : (
          <ul className="log-list">
            {workouts.map((w, i) => (
              <li key={i} className="log-item">
                <span>{w.date}</span>
                <span>{w.type || 'Workout'}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DailySummary;
