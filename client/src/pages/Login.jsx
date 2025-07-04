import React, { useState } from 'react';
import '../css/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Error during login');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form neon-border" onSubmit={handleSubmit}>
        <h2 className="form-title neon-glow">🔐 Login</h2>

        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          required
        />

        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="neon-button w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
