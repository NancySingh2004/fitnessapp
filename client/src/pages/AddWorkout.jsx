import React, { useState } from 'react';
import '../css/AddWorkout.css'; // Don't forget to create this CSS file

const AddWorkout = () => {
  const [workout, setWorkout] = useState({
    title: '',
    level: '',
    type: '',
    duration: '',
    description: '',
    exercises: [{ name: '', reps: '', videoURL: '' }]
  });

  const handleChange = (e) => {
    setWorkout({ ...workout, [e.target.name]: e.target.value });
  };

  const handleExerciseChange = (index, e) => {
    const updatedExercises = [...workout.exercises];
    updatedExercises[index][e.target.name] = e.target.value;
    setWorkout({ ...workout, exercises: updatedExercises });
  };

  const addExerciseField = () => {
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { name: '', reps: '', videoURL: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(workout)
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (res.status === 201) window.location.href = '/workouts';
    } catch (err) {
      alert('Error adding workout');
    }
  };

  return (
    <div className="add-workout-container">
      <h2 className="glow-title">➕ Add New Workout Plan</h2>
      <form onSubmit={handleSubmit} className="workout-form">
        <input name="title" placeholder="Workout Title" onChange={handleChange} required />
        <input name="level" placeholder="Level (Beginner/Intermediate/Advanced)" onChange={handleChange} required />
        <input name="type" placeholder="Type (Cardio/Strength/Yoga)" onChange={handleChange} required />
        <input name="duration" placeholder="Duration (minutes)" type="number" onChange={handleChange} required />
        <textarea name="description" placeholder="Workout Description" onChange={handleChange} required />

        <h3 className="section-sub">💪 Exercises</h3>
        {workout.exercises.map((exercise, index) => (
          <div key={index} className="exercise-block">
            <input
              name="name"
              placeholder="Exercise Name"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(index, e)}
              required
            />
            <input
              name="reps"
              placeholder="Reps (e.g. 3x10)"
              value={exercise.reps}
              onChange={(e) => handleExerciseChange(index, e)}
            />
            <input
              name="videoURL"
              placeholder="Video URL (optional)"
              value={exercise.videoURL}
              onChange={(e) => handleExerciseChange(index, e)}
            />
          </div>
        ))}

        <button type="button" className="neon-button add-btn" onClick={addExerciseField}>➕ Add Another Exercise</button>
        <button type="submit" className="neon-button submit-btn">✅ Submit Workout</button>
      </form>
    </div>
  );
};

export default AddWorkout;
