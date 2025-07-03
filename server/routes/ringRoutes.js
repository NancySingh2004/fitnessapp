const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ActivityRing = require('../models/ActivityRing');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// POST or UPDATE Activity
router.post('/', verifyToken, async (req, res) => {
  const { date, move, exercise, stand } = req.body;
  try {
    let entry = await ActivityRing.findOne({ userId: req.userId, date });
    if (entry) {
      entry.move = move;
      entry.exercise = exercise;
      entry.stand = stand;
    } else {
      entry = new ActivityRing({ userId: req.userId, date, move, exercise, stand });
    }
    await entry.save();
    res.json({ message: 'Activity saved', entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving activity' });
  }
});

// GET today's activity
router.get('/', verifyToken, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const entry = await ActivityRing.findOne({ userId: req.userId, date: today });
    res.json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching activity' });
  }
});

module.exports = router;
