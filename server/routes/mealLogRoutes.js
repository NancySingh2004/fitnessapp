const express = require('express');
const MealLog = require('../models/MealLog');
const jwt = require('jsonwebtoken');
const router = express.Router();

// middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};


// POST: Add meal for today
// POST: Add meal for today
router.post('/', verifyToken, async (req, res) => {
  try {
    const { date, meal } = req.body; // meal is the object you're sending

    console.log("📝 Incoming Meal:", meal); // <<< IMPORTANT: What does this output?
    console.log("📅 Date:", date);       // <<< IMPORTANT: What does this output?
    console.log("📝 Type of Incoming Meal:", typeof meal); // <<< Add this
    console.log("📝 Is Incoming Meal an Array?", Array.isArray(meal)); // <<< Add this
    // ... rest of your code
  } catch (error) {
    console.error("🔥 Meal Log Error:", error);
    res.status(500).json({ error: 'Server error while logging meal.' });
  }
});




// GET: User’s meal log
router.get('/', verifyToken, async (req, res) => {
  const logs = await MealLog.find({ userId: req.userId });
  res.json({ logs });
});

module.exports = router;
