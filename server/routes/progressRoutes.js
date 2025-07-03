const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const ProgressEntry = require('../models/ProgressEntry');

// Middleware to check token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// ✅ Add today's progress
router.post('/complete', verifyToken, async (req, res) => {
  const { date, workoutId } = req.body;
  try {
    const user = await User.findById(req.userId);
    const alreadyMarked = user.progress.find(p => p.date === date);
    if (alreadyMarked) return res.status(400).json({ error: 'Already marked for today' });

    user.progress.push({ date, workoutId });
    await user.save();
    res.json({ message: 'Progress marked!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get user's progress
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ progress: user.progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});
router.post('/add', async (req, res) => {
  const { userId, date, weight, steps, calories, mood } = req.body;
  try {
    const newEntry = new ProgressEntry({ userId, date, weight, steps, calories, mood });
    await newEntry.save();
    res.status(200).json({ message: 'Progress saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get all entries for user
router.get('/:userId', async (req, res) => {
  try {
    const entries = await ProgressEntry.find({ userId: req.params.userId });
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});
module.exports = router;
