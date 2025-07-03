import React, { useEffect, useState } from 'react';

const MealSuggestions = ({ goal = "weight loss" }) => {
  const [suggestion, setSuggestion] = useState([]);

  const suggestionsDB = {
    'weight loss': {
      Breakfast: ['Oats with fruits', 'Green smoothie', 'Boiled eggs'],
      Lunch: ['Grilled chicken salad', 'Quinoa with veggies'],
      Dinner: ['Mixed vegetable soup', 'Tofu stir fry'],
    },
    'muscle gain': {
      Breakfast: ['Omelette + Toast', 'Protein shake + banana'],
      Lunch: ['Chicken breast + rice', 'Paneer bhurji + roti'],
      Dinner: ['Fish curry + brown rice', 'Lentils + sweet potato'],
    }
  };

  useEffect(() => {
    const type = ['Breakfast', 'Lunch', 'Dinner'];
    const goalPlans = suggestionsDB[goal] || {};
    const suggestionList = type.map(t => ({
      time: t,
      meals: goalPlans[t] || []
    }));
    setSuggestion(suggestionList);
  }, [goal]);

  const icons = {
    Breakfast: '🌅',
    Lunch: '🌞',
    Dinner: '🌙',
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-outfit">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">🍽️ AI Meal Suggestions</h2>

        {suggestion.map((s, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {icons[s.time]} {s.time}
            </h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              {s.meals.map((meal, i) => (
                <li key={i}>{meal}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSuggestions;
