const express = require('express');
const Workout = require('../models/Workout');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Get all workouts
// GET /api/workouts?level=beginner&type=cardio
router.get('/', async (req, res) => {
  const { level, type } = req.query;
  const filter = {};
  if (level) filter.level = level;
  if (type) filter.type = type;

  const workouts = await Workout.find(filter);
  res.json(workouts);
});

// Get single workout by ID
router.get('/:id', async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).json({ error: 'Workout not found' });
  res.json(workout);
});

// Add new workout (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json({ message: 'Workout added successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add workout' });
  }
});

module.exports = router;
