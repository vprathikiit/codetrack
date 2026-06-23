export const fetchLeetCodeData = async (username) => {
  try {
    const response = await fetch(
      `https://leetcode-api-faisalshohag.vercel.app/${username}`
    );

    if (!response.ok) {
      throw new Error('User not found');
    }

    const text = await response.text();
    const data = JSON.parse(text);

    if (!data.totalSolved && data.totalSolved !== 0) {
      throw new Error('Invalid response');
    }

    return {
      username,
      easy: data.easySolved ?? 0,
      medium: data.mediumSolved ?? 0,
      hard: data.hardSolved ?? 0,
      total: data.totalSolved ?? 0,
      ranking: data.ranking ?? 'N/A',
      submissionCalendar: data.submissionCalendar ?? {}
    };

  } catch (error) {
    console.error('LeetCode API error:', error.message);
    return { username, error: true, errorMsg: error.message };
  }
};