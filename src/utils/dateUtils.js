const toLocalMidnight = (ts) => {
  const date = new Date(Number(ts) * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

export const getLast365Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    days.push({
      dateStr: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      timestamp: Math.floor(date.getTime() / 1000)
    });
  }

  return days;
};

export const mergeCalendars = (lcCalendar = {}, cfCalendar = {}) => {
  const merged = {};

  Object.entries(lcCalendar).forEach(([ts, count]) => {
    const day = toLocalMidnight(ts);
    merged[day] = (merged[day] || 0) + count;
  });

  Object.entries(cfCalendar).forEach(([ts, count]) => {
    const day = toLocalMidnight(ts);
    merged[day] = (merged[day] || 0) + count;
  });

  return merged;
};

export const getDayBreakdown = (timestamp, lcCalendar = {}, cfCalendar = {}) => {
  let lcCount = 0;
  let cfCount = 0;

  Object.entries(lcCalendar).forEach(([ts, count]) => {
    if (toLocalMidnight(ts) === timestamp) lcCount += count;
  });

  Object.entries(cfCalendar).forEach(([ts, count]) => {
    if (toLocalMidnight(ts) === timestamp) cfCount += count;
  });

  return { lcCount, cfCount };
};