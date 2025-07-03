import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../css/Scheduler.css'; // create this file for neon styling

const WorkoutScheduler = () => {
  const [date, setDate] = useState(new Date());
  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const userId = 'nancy123'; // replace with actual auth ID in production

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/schedule/${userId}`);
      setWorkouts(res.data);
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = date.toISOString().split('T')[0];

    try {
      await axios.post('http://localhost:5000/api/schedule/add', {
        userId,
        date: formattedDate,
        workout
      });
      setWorkout('');
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to add workout:', err);
    }
  };

  return (
    <div className="scheduler-container neon-border">
      <h2 className="scheduler-title glow-text">🏋️ Schedule Your Workout</h2>

      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} />
      </div>

      <form onSubmit={handleSubmit} className="scheduler-form">
        <label className="form-label">Workout for {date.toDateString()}:</label>
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
        {workouts.map((w, index) => (
          <li key={index} className="scheduled-item">
            <strong>{w.date}:</strong> {w.workout}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutScheduler;
