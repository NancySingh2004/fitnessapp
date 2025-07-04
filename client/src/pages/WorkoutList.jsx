import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/WorkoutList.css';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const fetchWorkouts = async () => {
    let query = '';
    if (level) query += `level=${level}`;
    if (type) query += `${query ? '&' : ''}type=${type}`;
    try {
      const res = await fetch(`${API_BASE}/api/workouts?${query}`);
      const data = await res.json();
      setWorkouts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch workouts. Please try again later.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [level, type]);

  const getEmoji = (type) => {
    switch (type) {
      case 'cardio': return '🏃‍♀️';
      case 'strength': return '💪';
      case 'yoga': return '🧘‍♀️';
      default: return '🏋️‍♂️';
    }
  };

  return (
    <div className="workout-list-container">
      <h2 className="glow-title">🏋️ Explore Workouts</h2>

      <div className="filter-controls">
        <select className="neon-select" onChange={(e) => setLevel(e.target.value)} value={level}>
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select className="neon-select" onChange={(e) => setType(e.target.value)} value={type}>
          <option value="">All Types</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="yoga">Yoga</option>
        </select>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="workout-list">
        {workouts.length === 0 && !error ? (
          <p className="text-gray-500 mt-4">No workouts found for selected filters.</p>
        ) : (
          workouts.map(workout => (
            <div key={workout._id} className="workout-item glass-card">
              <Link to={`/workouts/${workout._id}`} className="workout-link">
                <span className="emoji">{getEmoji(workout.type)}</span>
                <span className="workout-title">{workout.title}</span>
              </Link>
              <div className="workout-meta">
                <span className="duration">{workout.duration} mins</span>
                <span className={`badge ${workout.level}`}>{workout.level}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
