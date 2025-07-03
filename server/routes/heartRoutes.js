const express = require('express');
const router = express.Router();
const Heart = require('../models/Heart');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// POST: Save heart data
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bpm, timestamp } = req.body;
    await Heart.create({ userId: req.userId, bpm, timestamp });
    res.json({ message: 'Heart rate saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving heart rate' });
  }
});

// GET: Get historical data
router.get('/', verifyToken, async (req, res) => {
  const data = await Heart.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(100);
  res.json({ data });
});

module.exports = router;
