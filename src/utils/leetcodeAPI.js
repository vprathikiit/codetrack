export const fetchLeetCodeData = async(username) => {
    try {
        const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);

        if(!response.ok) {
            throw new Error('User not found');
        }

        const data = await response.json();

        return {
          username: username,
          easy: data.easySolved ?? 0,
          medium: data.mediumSolved ?? 0,
          hard: data.hardSolved ?? 0,
          total: data.totalSolved ?? 0,
          ranking: data.ranking ?? 'N/A',
          submissionCalendar: data.submissionCalendar ?? {}
        };
    }

    catch(error) {
        console.error('LeetCode API Error:', error);
        return null;
    }
};