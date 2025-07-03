import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const features = [
  { path: '/dashboard', title: 'DASHBOARD', emoji: '📋', desc: 'Your fitness control panel' },
  { path: '/workouts', title: 'Workout Plans', emoji: '🏋️', desc: 'View all saved workouts' },
  { path: '/workouts/add', title: 'Add Workout', emoji: '➕', desc: 'Create custom workout plans' },
  { path: '/scheduler', title: 'Workout Scheduler', emoji: '📆', desc: 'Schedule your workouts' },
  { path: '/progress', title: 'Progress Tracker', emoji: '📊', desc: 'Track weight, steps & more' },
  { path: '/nutrition', title: 'Nutrition Plans', emoji: '🥗', desc: 'Healthy meal planning' },
  { path: '/ring-tracker', title: 'Smart Ring', emoji: '💍', desc: 'Track steps, heart rate & sleep' },
  { path: '/summary', title: 'Daily Summary', emoji: '📅', desc: 'View your full day summary' },
  { path: '/chatbot', title: 'Chatbot', emoji: '🤖', desc: 'View AI Suggestions' }

];

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`home-container futuristic ${darkMode ? 'dark' : ''}`}>
      <button className="toggle-btn neon-glow" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="hero neon-border">
        <h1 className="glow-title">💪 Your Ultimate Fitness Companion</h1>
        <p className="glow-sub">Smart workouts, AI meal plans & personalized progress tracking.</p>
      </div>

      <div className="features-grid">
        {features.map((feat, i) => (
          <Link to={feat.path} key={i} className="neon-card">
            <div className={`feature-card futuristic row-${i}`}>
              <div className="feature-icon neon-glow">{feat.emoji}</div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="cta-buttons">
        <Link to="/register">
          <button className="neon-button">Register</button>
        </Link>
        <Link to="/login">
          <button className="neon-button alt">Login</button>
        </Link>
      </div>

      <footer className="footer-text glow-text">
        Made with ❤️ by Nancy
      </footer>
    </div>
  );
};

export default Home;
