import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { getLast7Days, groupProgressByDate, calculateStreaks } from '../lib/dateUtils';
import { Tooltip } from 'react-tooltip';
import '../css/Progress.css'; // 💡 Your custom neon-themed styles

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [marked, setMarked] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const fetchProgress = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProgress(data.progress);
    if (data.progress.find(p => p.date === today)) setMarked(true);
  };

  const markToday = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/progress/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: today })
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchProgress();
  };

  // Rest of your component remains unchanged...


  useEffect(() => {
    fetchProgress();
  }, []);

  const getMonthStats = (progress) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const completed = progress.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    return [
      { name: 'Completed', value: completed },
      { name: 'Missed', value: daysInMonth - completed },
    ];
  };

  const COLORS = ['#22c55e', '#f87171'];
  const last7 = getLast7Days();
  const grouped = groupProgressByDate(progress);
  const { currentStreak, longestStreak } = calculateStreaks(progress);

  const chartData = last7.map(date => ({
    date,
    done: grouped[date] ? 1 : 0,
  }));

  const total = progress.length;
  const achievements = [];
  if (currentStreak >= 3) achievements.push('🔥 3-Day Streak!');
  if (currentStreak >= 7) achievements.push('🔥 7-Day Streak!');
  if (longestStreak >= 10) achievements.push('🏆 Longest Streak: 10+!');
  if (total >= 30) achievements.push('🎖️ 30 Workouts Completed!');

  return (
    <div className="progress-container">
      <h2 className="progress-heading">📅 Workout Progress</h2>

      <button onClick={markToday} disabled={marked} className="mark-btn">
        {marked ? '✅ Completed Today' : '✔️ Mark Today as Done'}
      </button>

      <h3 className="chart-title">📈 This Week</h3>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <RechartTooltip />
            <Bar dataKey="done" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="streaks">
        <p>🔥 <strong>Current Streak:</strong> {currentStreak} days</p>
        <p>🏆 <strong>Longest Streak:</strong> {longestStreak} days</p>
      </div>

     <div className="heatmap-wrapper">
  <CalendarHeatmap
    startDate={new Date(new Date().setDate(new Date().getDate() - 90))}
    endDate={new Date()}
    values={progress.map(p => ({ date: p.date, count: 1 }))}
    classForValue={value => {
      if (!value) return 'color-empty';
      if (value.count >= 4) return 'color-scale-4';
      if (value.count === 3) return 'color-scale-3';
      if (value.count === 2) return 'color-scale-2';
      if (value.count === 1) return 'color-scale-1';
      return 'color-empty';
    }}
    tooltipDataAttrs={value =>
      value.date
        ? {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': `${value.date}`
          }
        : {}
    }
    gutterSize={2}
    showWeekdayLabels={false}
    horizontal={true}
  />
  <Tooltip id="heatmap-tooltip" />
</div>


      <div className="pie-section">
  <h3 className="chart-title">📊 Monthly Completion</h3>
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={getMonthStats(progress)}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        innerRadius={40}
        label={({ name, percent }) =>
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
        labelLine={false}
      >
        {getMonthStats(progress).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>


      <div className="achievements">
        <h3>🏅 Achievements</h3>
        <ul>
          {achievements.length > 0
            ? achievements.map((a, i) => <li key={i}>{a}</li>)
            : <li>No badges earned yet. Keep going!</li>}
        </ul>
      </div>
    </div>
  );
};

export default Progress;
