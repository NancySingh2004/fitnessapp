import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/workouts/${id}`);
        const data = await res.json();
        setWorkout(data);
      } catch (error) {
        console.error('Error fetching workout details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id, API_BASE]);

  if (loading) return <p className="text-center mt-6">Loading workout details...</p>;
  if (!workout) return <p className="text-center mt-6 text-red-500">Workout not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-2">{workout.title}</h2>
      <p className="text-gray-600 dark:text-gray-300"><strong>Level:</strong> {workout.level}</p>
      <p className="text-gray-600 dark:text-gray-300"><strong>Type:</strong> {workout.type}</p>
      <p className="text-gray-600 dark:text-gray-300"><strong>Duration:</strong> {workout.duration} mins</p>
      <p className="mt-4">{workout.description}</p>

      <h3 className="mt-6 text-xl font-semibold">Exercises:</h3>
      <ul className="list-disc list-inside mt-2 space-y-1">
        {workout.exercises && workout.exercises.length > 0 ? (
          workout.exercises.map((ex, index) => (
            <li key={index}>
              <span>{ex.name} - {ex.reps}</span>
              {ex.videoURL && (
                <a
                  href={ex.videoURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline ml-2"
                >
                  ▶️ Video
                </a>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No exercises listed.</p>
        )}
      </ul>
    </div>
  );
};

export default WorkoutDetail;
