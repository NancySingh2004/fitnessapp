import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../css/Scheduler.css';

const WorkoutScheduler = () => {
  const [date, setDate] = useState(new Date());
  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  // TODO: Replace this with actual user ID from auth token or user context
  const userId = 'nancy123';

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/schedule/${userId}`);
      setWorkouts(res.data);
    } catch (err) {
      console.error('❌ Error fetching workouts:', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = date.toISOString().split('T')[0];

    try {
      await axios.post(`${API_BASE}/api/schedule/add`, {
        userId,
        date: formattedDate,
        workout
      });
      setWorkout('');
      fetchWorkouts();
    } catch (err) {
      console.error('❌ Failed to add workout:', err);
    }
  };

  return (
    <div className="scheduler-container neon-border">
      <h2 className="scheduler-title glow-text">🏋️ Schedule Your Workout</h2>

      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} />
      </div>

      <form onSubmit={handleSubmit} className="scheduler-form">
        <label className="form-label">
          Workout for <span className="highlight-date">{date.toDateString()}</span>:
        </label>
        <input
          type="text"
          value={workout}
          onChange={(e) => setWorkout(e.target.value)}
          className="neon-input"
          placeholder="e.g., Chest + Triceps"
          required
        />
        <button type="submit" className="neon-button">💾 Save Workout</button>
      </form>

      <h3 className="scheduled-title">📅 Your Scheduled Workouts</h3>
      <ul className="scheduled-list">
        {workouts.length === 0 ? (
          <li className="scheduled-item">No workouts scheduled yet.</li>
        ) : (
          workouts.map((w, index) => (
            <li key={index} className="scheduled-item">
              <strong>{w.date}:</strong> {w.workout}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default WorkoutScheduler;
