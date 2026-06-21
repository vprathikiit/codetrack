export const fetchContests = async() => {
  try {
    const response = await fetch(
      'https://codeforces.com/api/contest.list?gym=false'
    );
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error('Failed to fetch contests');
    }

    const now = Math.floor(Date.now() / 1000);

    const upcoming = data.result
      .filter(c => c.phase === 'BEFORE')
      .map(c => ({
        id: c.id,
        name: c.name,
        startTime: c.startTimeSeconds,
        duration: c.durationSeconds,
        type: c.type
      }))
      .slice(0, 5);

    const past = data.result
      .filter(c => c.phase === 'FINISHED')
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: c.name,
        startTime: c.startTimeSeconds,
        duration: c.durationSeconds,
        type: c.type
      }));

    return { upcoming, past };
  } 
  catch(err) {
    console.error('Contest fetch error:', err);
    return { upcoming: [], past: [] };
  }
};

export const fetchRatingHistory = async (username) => {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error('Failed to fetch rating');
    }

    return data.result.map(entry => ({
      contestId: entry.contestId,
      contestName: entry.contestName,
      rank: entry.rank,
      oldRating: entry.oldRating,
      newRating: entry.newRating,
      ratingChange: entry.newRating - entry.oldRating,
      date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString(
        'en-US', { month: 'short', day: 'numeric', year: 'numeric' }
      ),
      timestamp: entry.ratingUpdateTimeSeconds
    }));
  } 
  catch(err) {
    console.error('Rating history error:', err);
    return [];
  }
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

export const formatCountdown = (startTime) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = startTime - now;

  if (diff <= 0) {
    return 'Starting now';
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};