import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/WorkoutList.css';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');

  const fetchWorkouts = async () => {
    let query = '';
    if (level) query += `level=${level}`;
    if (type) query += `${query ? '&' : ''}type=${type}`;
    const res = await fetch(`http://localhost:5000/api/workouts?${query}`);
    const data = await res.json();
    setWorkouts(data);
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
  <select className="neon-select" onChange={(e) => setLevel(e.target.value)}>
    <option value="">All Levels</option>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="advanced">Advanced</option>
  </select>

  <select className="neon-select" onChange={(e) => setType(e.target.value)}>
    <option value="">All Types</option>
    <option value="cardio">Cardio</option>
    <option value="strength">Strength</option>
    <option value="yoga">Yoga</option>
  </select>
</div>


      <div className="workout-list">
        {workouts.map(workout => (
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
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;
