import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`);
      const data = await res.json();
      setWorkout(data);
    };
    fetchWorkout();
  }, [id]);

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{workout.title}</h2>
      <p><strong>Level:</strong> {workout.level}</p>
      <p><strong>Type:</strong> {workout.type}</p>
      <p><strong>Duration:</strong> {workout.duration} mins</p>
      <p>{workout.description}</p>
      <h3 className="mt-4 font-semibold">Exercises:</h3>
      <ul>
        {workout.exercises.map((ex, index) => (
          <li key={index}>
            {ex.name} - {ex.reps} 
            {ex.videoURL && <a href={ex.videoURL} target="_blank" rel="noreferrer"> ▶️ Video</a>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutDetail;
