const express = require('express');
const router = express.Router();
const WorkoutSchedule = require('../models/WorkoutSchedule');

// 📌 Add workout to calendar
router.post('/add', async (req, res) => {
  const { userId, date, workout } = req.body;

  try {
    const newEntry = new WorkoutSchedule({ userId, date, workout });
    await newEntry.save();
    res.status(200).json({ message: 'Workout scheduled successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add workout' });
  }
});

// 📌 Get all workouts for a user
router.get('/:userId', async (req, res) => {
  try {
    const data = await WorkoutSchedule.find({ userId: req.params.userId });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

module.exports = router;
