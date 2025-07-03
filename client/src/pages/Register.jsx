import React, { useState } from 'react';
import '../css/Register.css'; // 👈 custom styles here

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    goal: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      alert(data.message || data.error);
    } catch (error) {
      alert('Error during registration');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">🚀 Join the Fitness Revolution</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="goal" placeholder="Fitness Goal (e.g., Lose Weight)" onChange={handleChange} />
        <button type="submit" className="neon-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
