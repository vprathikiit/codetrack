// ============================================
// LEETCODE XP
// ============================================

export const lcLifetimeXP = (lcData) => {
  if (!lcData) {
    return 0;
  }
  return (
    (lcData.easy || 0) * 10 +
    (lcData.medium || 0) * 25 +
    (lcData.hard || 0) * 50
  );
};

export const lcWeeklyXP = (lcData) => {
  if (!lcData) {
    return 0;
  }

  const total = lcData.total || 0;
  if (total === 0) return 0;

  const easyRatio = (lcData.easy || 0) / total;
  const mediumRatio = (lcData.medium || 0) / total;
  const hardRatio = (lcData.hard || 0) / total;

  const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  let weeklyCount = 0;

  if (lcData.submissionCalendar) {
    Object.entries(lcData.submissionCalendar).forEach(([ts, count]) => {
      if (Number(ts) >= oneWeekAgo) {
        weeklyCount += count;
      }
    });
  }

  return Math.round(
    weeklyCount * easyRatio * 10 +
    weeklyCount * mediumRatio * 25 +
    weeklyCount * hardRatio * 50
  );
};


export const cfProblemXP = (rating) => {
  if (!rating || rating < 1200) {
    return 25;
  }
  if (rating < 1400) {
    return 40;
  }
  if (rating < 1600) {
    return 60;
  }
  if (rating < 1800) {
    return 80;
  }
  if (rating < 2000) {
    return 100;
  }
  if (rating < 2200) {
    return 120;
  }
  return 150;
};

export const cfLifetimeXP = (cfData) => {
  if (!cfData?.submissions) {
    return 0;
  }

  let xp = 0;
  const seen = new Set();

  cfData.submissions.forEach((sub) => {
    if (sub.verdict !== 'OK') {
        return;
    }
    const key = `${sub.problem.name}-${sub.problem.rating}`;
    if (seen.has(key)) {
        return; 
    }
    seen.add(key);
    xp += cfProblemXP(sub.problem.rating || 800);
  });

  return xp;
};

export const cfWeeklyXP = (cfData) => {
  if (!cfData?.submissions) {
    return 0;
  }

  const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  let xp = 0;
  const seen = new Set();

  cfData.submissions.forEach((sub) => {
    if (sub.creationTimeSeconds < oneWeekAgo) {
        return;
    }
    if (sub.verdict !== 'OK') {
        return;
    }
    const key = `${sub.problem.name}-${sub.problem.rating}`;
    if (seen.has(key)) {
        return;
    }
    seen.add(key);
    xp += cfProblemXP(sub.problem.rating || 800);
  });

  return xp;
};

export const calculateStreak = (lcCalendar = {}, cfCalendar = {}) => {
  const merged = {};

  Object.entries(lcCalendar).forEach(([ts, count]) => {
    const day = Math.floor(Number(ts) / 86400) * 86400;
    merged[day] = (merged[day] || 0) + count;
  });

  Object.entries(cfCalendar).forEach(([ts, count]) => {
    const day = Math.floor(Number(ts) / 86400) * 86400;
    merged[day] = (merged[day] || 0) + count;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const ts = Math.floor(
      Date.UTC(
        checkDate.getFullYear(),
        checkDate.getMonth(),
        checkDate.getDate()
      ) / 1000
    );

    if (merged[ts] && merged[ts] > 0) {
      tempStreak++;
      if (i === 0 || currentStreak > 0) {
        currentStreak = tempStreak;
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      if (i === 0) {
      } 
      else {
        if (currentStreak === 0) {
            currentStreak = 0;
        }
        tempStreak = 0;
      }
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { currentStreak, bestStreak };
};

export const streakBonusXP = (currentStreak) => {
  let bonus = 0;
  if (currentStreak >= 100) {
    bonus += 1000;
  }
  else if (currentStreak >= 30) {
    bonus += 250;
  }
  else if (currentStreak >= 7) {
    bonus += 50;
  }
  return bonus;
};

export const activityBonusXP = (lcCalendar = {}, cfCalendar = {}) => {
  const merged = {};

  Object.entries(lcCalendar).forEach(([ts, count]) => {
    const day = Math.floor(Number(ts) / 86400) * 86400;
    merged[day] = (merged[day] || 0) + count;
  });

  Object.entries(cfCalendar).forEach(([ts, count]) => {
    const day = Math.floor(Number(ts) / 86400) * 86400;
    merged[day] = (merged[day] || 0) + count;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let activeLast7 = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ts = Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000
    );
    if (merged[ts] && merged[ts] > 0) activeLast7++;
  }

  return activeLast7 === 7 ? 75 : 0;
};

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

export const getStreakBadge = (streak) => {
  if (streak >= 100) {
    return '🔥 Century Coder';
  }
  if (streak >= 30) {
    return '🔥 Monthly Master';
  }
  if (streak >= 7) {
    return '🔥 Week Warrior';
  }
  return null;
};