import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkoutList from './pages/WorkoutList';
import WorkoutDetail from './pages/WorkoutDetail';
import AddWorkout from './pages/AddWorkout';
import Progress from './pages/Progress';
import NutritionPlans from './pages/NutritionPlans';
import MealLog from './pages/MealLog';
import MealSuggestions from './pages/MealSuggestions';
import DailySummary from './pages/DailySummary';
import WorkoutScheduler from './components/WorkoutScheduler';
import FitnessRing from './components/RingTracker'
import FitnessChatbot from './components/FitnessChatbot';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/workouts' element={<WorkoutList />} />
        <Route path='/workouts/:id' element={<WorkoutDetail />} />
        <Route path='/workouts/add' element={<AddWorkout />} />
        <Route path='/progress' element={<Progress />} />
        <Route path='/nutrition' element={<NutritionPlans />} />
        <Route path="/meal-log" element={<MealLog />} />
        <Route path="/meal-suggestions" element={<MealSuggestions />} />
        <Route path="/summary" element={<DailySummary />} />
        <Route path="/scheduler" element={<WorkoutScheduler/>} />
        <Route path="/ring-tracker" element={<FitnessRing/>}/>
         <Route path="/chatbot" element={<FitnessChatbot/>}/>
      </Routes>
    </Router>
  );
}

export default App;
