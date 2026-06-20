export const calculateWeeklyScore = (lcData, cfData) => {
    let score = 0;
    const now = Math.floor(Date.now() / 1000);
    const oneWeekAgo = now - 7 * 24 * 60 * 60;

    if(lcData?.submissionCalendar) {
        Object.entries(lcData.submissionCalendar).forEach(([timestamp, count]) => {
            if(Number(timestamp) >= oneWeekAgo) {
                score += count * 2;
            }
        });
    }

    if(cfData?.submissionCalendar) {
        Object.entries(cfData.submissionCalendar).forEach(([timestamp, count]) => {
            if(Number(timestamp) >= oneWeekAgo) {
                score += count * 5;
            }
        });
    }
    return score;
}

export const calculateTotalScore = (lcData, cfData) => {
    let score= 0;

    if(lcData) {
        score += (lcData.easy || 0) * 1;
        score += (lcData.medium || 0) * 3;
        score += (lcData.hard || 0) * 5;
    }

    if(cfData) {
        score += (cfData.totalSubmissions || 0) * 2;
    }

    return score;
};