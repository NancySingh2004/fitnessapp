require('dotenv').config();
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
console.log("🧠 OPENAI_API_KEY:", process.env.GEMINI_API_KEY);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const progressRoutes = require('./routes/progressRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const mealLogRoutes = require('./routes/mealLogRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const ringRoutes = require('./routes/ringRoutes');
const geminiChat = require('./routes/geminiChat');




const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/meallog', mealLogRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/rings', ringRoutes);
app.use('/api/gemini', geminiChat);




mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 5000;
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
