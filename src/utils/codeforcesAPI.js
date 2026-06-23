const getTierInfo = (rating) => {
    if(!rating) {
        return {tier: 'Unrated', color: '#8b949e'};
    }
    if(rating < 1200) {
        return {tier: 'Newbie', color: '#808080'};
    }
    if(rating < 1400) {
        return {tier: 'Pupil', color: '#008000'};
    }
    if(rating < 1600) {
        return {tier: 'Specialist', color: '#03a89e'};
    }
    if(rating < 1900) {
        return {tier: 'Expert', color: '#0000ff'};
    }
    if(rating < 2100) {
        return {tier: 'Cadidate Master', color: '#aa00aa'};
    }
    if(rating < 2300) {
        return {tier: 'Master', color: '#ff8c00'};
    }
    if(rating < 2400) {
        return {tier: 'International Master', color: '#ff8c00'};
    }
    if(rating < 2600) {
        return {tier: 'Grandmaster', color: '#ff0000'};
    }
    if(rating < 3000) {
        return {tier: 'International Grandmaster', color: '#ff0000'};
    }
    return {tier: 'Legendary Grandmaster', color: '#ff0000'};
};

export const fetchCodeforcesData = async(username) => {
    try {
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);

        if(!userResponse.ok) {
            throw new Error('Error not found');
        }

        const userData = await userResponse.json();

        if(userData.status !== 'OK') {
            throw new Error(userData.comment || 'User not found');
        }

        const user = userData.result[0];

        const {tier, color} = getTierInfo(user.rating);

        const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}&count=1000`);

        const submissionsData = await submissionsResponse.json();
        const submissions = submissionsData.status === 'OK' ? submissionsData.result : [];

        const calendar = {};
        submissions.forEach((sub) => {
            const day = Math.floor(sub.creationTimeSeconds / 86400) * 86400;
            calendar[day] = (calendar[day] || 0) + 1;
        });

        const tagStats = {};
        submissions.forEach((sub) => {
            if(!sub.problem.tags) {
                return;
            }
            sub.problem.tags.forEach((tag) => {
                if(!tagStats[tag]) {
                    tagStats[tag] = {total : 0, accepted : 0};
                }
                tagStats[tag].total += 1;
                if(sub.verdict === 'OK') {
                    tagStats[tag].accepted += 1;
                }
            });
        });

        return {
            username: username,
            rating: user.rating ?? 'Unrated',
            maxRating: user.maxRating ?? 'N/A',
            tier: tier,
            tierColor: color,
            country: user.country ?? '',
            avatar: user.avater ?? '',
            submissionCalendar: calendar,
            tagStats: tagStats,
            totalSubmissions: submissions.length,
            submissions: submissions
        };
    }
     catch (error) {
    console.error('Codeforces API error:', error.message);
    return { username, error: true, errorMsg: error.message };
  }
};