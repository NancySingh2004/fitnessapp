import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) return <div className="dashboard-loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>👋 Welcome, <span>{user.name}</span></h1>
        <p>{user.email}</p>
        <div className="goal-banner">
          🎯 Goal: <strong>{user.goal || "Set your goal"}</strong>
        </div>
      </header>

      <section className="stats-section">
        <div className="stat-box glow-card">
          <h2>2</h2>
          <p>Workouts Today</p>
        </div>
        <div className="stat-box glow-card blue">
          <h2>1500</h2>
          <p>Calories Burned</p>
        </div>
        <div className="stat-box glow-card green">
          <h2>6,200</h2>
          <p>Steps Walked</p>
        </div>
        <div className="stat-box glow-card pink">
          <h2>😊</h2>
          <p>Mood</p>
        </div>
      </section>

      <section className="dashboard-actions">
        <a href="/workouts/add" className="action-btn">➕ Add Workout</a>
        <a href="/ring-tracker" className="action-btn alt">💍 Smart Ring</a>
        <a href="/progress" className="action-btn">📊 View Progress</a>
      </section>
    </div>
  );
};

export default Dashboard;
