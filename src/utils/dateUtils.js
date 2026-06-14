export const getLast365Days = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for(let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const timestamp = Math.floor(date.getTime() / 1000);

        const utcMidnight = Math.floor(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000
        );

        days.push({
            dateStr: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            timestamp: utcMidnight,
            localTimestamp: timestamp
        });
    }

    return days;
};

export const mergeCalendars = (lcCalendar = {}, cfCalendar = {}) => {
    const merged = {};
    Object.entries(lcCalendar).forEach(([timestamp, count]) => {
        const day = Math.floor(Number(timestamp) / 86400) * 86400;
        merged[day] = (merged[day] || 0) + count;
    });

    Object.entries(cfCalendar).forEach(([timestamp, count]) => {
        const day = Math.floor(Number(timestamp) / 86400) * 86400;
        merged[day] = (merged[day] || 0) + count;
    });

    return merged;
};

export const getDayBreakdown = (timestamp, lcCalendar = {}, cfCalendar = {}) => {
    const day = Math.floor(Number(timestamp) * 86400) / 86400;

    let lcCount = 0;
    let cfCount = 0;

    Object.entries(lcCalendar).forEach(([ts, count]) => {
        if(Math.floor(Number(ts) / 86400) * 86400 === day) {
            lcCount += count;
        }
    });

    Object.entries(cfCalendar).forEach(([ts, count]) => {
        if(Math.floor(Number(ts) / 86400) * 86400 === day) {
            cfCount += count;
        }
    });

    return {lcCount, cfCount};
};