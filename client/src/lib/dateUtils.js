export const getLast7Days = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const groupProgressByDate = (progressArray) => {
  const grouped = {};
  for (const item of progressArray) {
    grouped[item.date] = (grouped[item.date] || 0) + 1;
  }
  return grouped;
};
export const calculateStreaks = (progressArray) => {
  const dates = progressArray.map(p => p.date).sort().reverse();
  const today = new Date().toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let prevDate = new Date(today);

  for (let dateStr of dates) {
    const date = new Date(dateStr);
    const diff = (prevDate - date) / (1000 * 60 * 60 * 24);

    if (diff === 1 || (currentStreak === 0 && diff === 0)) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0;
    }

    prevDate = date;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
};

