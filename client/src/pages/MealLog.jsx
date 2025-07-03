import React, { useEffect, useState } from 'react';
import '../css/MealLog.css';

const MealLog = () => {
  const [logs, setLogs] = useState([]);
  const [items, setItems] = useState('');
  const [type, setType] = useState('Breakfast');
  const [calories, setCalories] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/meallog', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLogs(data.logs);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/meallog', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: today,
        meal: {
          type,
          items: items.split(',').map(i => i.trim()),
          calories: parseInt(calories)
        }
      }),
    });
    setItems('');
    setCalories('');
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="meal-log-container">
      <h2 className="meal-log-title">🍛 Custom Meal Log</h2>

      <div className="meal-log-form">
        <select value={type} onChange={e => setType(e.target.value)} className="meal-select">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
        </select>
        <input
          type="text"
          placeholder="Meal items (comma separated)"
          value={items}
          onChange={e => setItems(e.target.value)}
          className="meal-input"
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          className="meal-input"
        />
        <button onClick={handleSubmit} className="meal-button">
          ➕ Add Meal
        </button>
      </div>

      <h3 className="meal-log-subtitle">📅 Your Logs</h3>
      <ul className="meal-log-list">
        {logs.map((log, idx) => (
          <li key={idx}>
            <strong className="log-date">{log.date}</strong>
            <ul className="log-meals">
              {log.meals.map((meal, j) => (
                <li key={j} className="log-meal-item">
                  <span className="meal-type">{meal.type}:</span> {meal.items.join(', ')} <span className="meal-calories">({meal.calories} kcal)</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealLog;
