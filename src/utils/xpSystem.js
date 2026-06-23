// ============================================
// LEETCODE XP
// ============================================

export const lcLifetimeXP = (lcData) => {
  if (!lcData) return 0;
  return (
    (lcData.easy || 0) * 10 +
    (lcData.medium || 0) * 25 +
    (lcData.hard || 0) * 50
  );
};

export const lcWeeklyXP = (lcData) => {
  if (!lcData) return 0;

  const total = lcData.total || 0;
  if (total === 0) return 0;

  const easyRatio = (lcData.easy || 0) / total;
  const mediumRatio = (lcData.medium || 0) / total;
  const hardRatio = (lcData.hard || 0) / total;

  const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  let weeklyCount = 0;

  if (lcData.submissionCalendar) {
    Object.entries(lcData.submissionCalendar).forEach(([ts, count]) => {
      if (Number(ts) >= oneWeekAgo) weeklyCount += count;
    });
  }

  return Math.round(
    weeklyCount * easyRatio * 10 +
    weeklyCount * mediumRatio * 25 +
    weeklyCount * hardRatio * 50
  );
};

// ============================================
// CODEFORCES XP
// ============================================

export const cfProblemXP = (rating) => {
  if (!rating || rating < 1200) return 25;
  if (rating < 1400) return 40;
  if (rating < 1600) return 60;
  if (rating < 1800) return 80;
  if (rating < 2000) return 100;
  if (rating < 2200) return 120;
  return 150;
};

export const cfLifetimeXP = (cfData) => {
  if (!cfData?.submissions) return 0;

  let xp = 0;
  const seen = new Set();

  cfData.submissions.forEach((sub) => {
    if (sub.verdict !== 'OK') return;
    const key = `${sub.problem.name}-${sub.problem.rating}`;
    if (seen.has(key)) return;
    seen.add(key);
    xp += cfProblemXP(sub.problem.rating || 800);
  });

  return xp;
};

export const cfWeeklyXP = (cfData) => {
  if (!cfData?.submissions) return 0;

  const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  let xp = 0;
  const seen = new Set();

  cfData.submissions.forEach((sub) => {
    if (sub.creationTimeSeconds < oneWeekAgo) return;
    if (sub.verdict !== 'OK') return;
    const key = `${sub.problem.name}-${sub.problem.rating}`;
    if (seen.has(key)) return;
    seen.add(key);
    xp += cfProblemXP(sub.problem.rating || 800);
  });

  return xp;
};

// ============================================
// STREAK — uses local midnight consistently
// ============================================

const toLocalMidnight = (ts) => {
  const date = new Date(Number(ts) * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

export const calculateStreak = (lcCalendar = {}, cfCalendar = {}) => {
  // Build set of active days using LOCAL midnight
  const activeDays = new Set();

  Object.entries(lcCalendar).forEach(([ts, count]) => {
    if (count > 0) activeDays.add(toLocalMidnight(ts));
  });

  Object.entries(cfCalendar).forEach(([ts, count]) => {
    if (count > 0) activeDays.add(toLocalMidnight(ts));
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let currentStreakEnded = false;

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const ts = Math.floor(date.getTime() / 1000);

    if (activeDays.has(ts)) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
      if (!currentStreakEnded) {
        currentStreak = tempStreak;
      }
    } else {
      if (i === 0) {
        // No activity today yet — don't break streak, check yesterday
        continue;
      }
      if (!currentStreakEnded) currentStreakEnded = true;
      tempStreak = 0;
    }
  }

  return { currentStreak, bestStreak };
};

// ============================================
// STREAK BONUS XP
// ============================================

export const streakBonusXP = (currentStreak) => {
  let bonus = 0;
  if (currentStreak >= 100) bonus += 1000;
  else if (currentStreak >= 30) bonus += 250;
  else if (currentStreak >= 7) bonus += 50;
  return bonus;
};

// ============================================
// ACTIVITY BONUS — also uses local midnight
// ============================================

export const activityBonusXP = (lcCalendar = {}, cfCalendar = {}) => {
  const activeDays = new Set();

  Object.entries(lcCalendar).forEach(([ts, count]) => {
    if (count > 0) activeDays.add(toLocalMidnight(ts));
  });

  Object.entries(cfCalendar).forEach(([ts, count]) => {
    if (count > 0) activeDays.add(toLocalMidnight(ts));
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let activeLast7 = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const ts = Math.floor(d.getTime() / 1000);
    if (activeDays.has(ts)) activeLast7++;
  }

  return activeLast7 === 7 ? 75 : 0;
};

// ============================================
// TOTAL XP
// ============================================

export const calculateLifetimeXP = (lcData, cfData) => {
  const lc = lcLifetimeXP(lcData);
  const cf = cfLifetimeXP(cfData);
  const { currentStreak } = calculateStreak(
    lcData?.submissionCalendar ?? {},
    cfData?.submissionCalendar ?? {}
  );
  const streak = streakBonusXP(currentStreak);
  const activity = activityBonusXP(
    lcData?.submissionCalendar ?? {},
    cfData?.submissionCalendar ?? {}
  );
  return lc + cf + streak + activity;
};

export const calculateWeeklyXP = (lcData, cfData) => {
  return lcWeeklyXP(lcData) + cfWeeklyXP(cfData);
};

// ============================================
// LEVEL
// ============================================

export const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 500)) + 1;
};

export const xpForLevel = (level) => {
  return Math.pow(level - 1, 2) * 500;
};

export const xpForNextLevel = (level) => {
  return Math.pow(level, 2) * 500;
};

export const getLevelProgress = (xp) => {
  const level = calculateLevel(xp);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForNextLevel(level);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return {
    level,
    xp,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(100, Math.round(progress))
  };
};

// ============================================
// STREAK BADGE
// ============================================

export const getStreakBadge = (streak) => {
  if (streak >= 100) return '🔥 Century Coder';
  if (streak >= 30) return '🔥 Monthly Master';
  if (streak >= 7) return '🔥 Week Warrior';
  return null;
};