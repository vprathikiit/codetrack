const TAG_MAP = {
  'dp': 'Dynamic Programming',
  'graphs': 'Graphs',
  'trees': 'Trees',
  'greedy': 'Greedy',
  'binary search': 'Binary Search',
  'two pointers': 'Two Pointers',
  'strings': 'Strings',
  'math': 'Math',
  'sorting': 'Sorting',
  'dfs and similar': 'DFS',
  'bfs': 'BFS',
  'data structures': 'Data Structures',
  'number theory': 'Number Theory',
  'combinatorics': 'Combinatorics',
  'implementation': 'Implementation',
  'brute force': 'Brute Force',
  'constructive algorithms': 'Constructive',
  'divide and conquer': 'Divide & Conquer',
};

const PRIORITY_TAGS = [
    'dp',
    'graphs',
    'trees',
    'greedy',
    'binary search',
    'two pointers',
    'strings',
    'math',
    'dfs ans similar',
    'data structures',
    'sorting',
    'number theory',
    'implementation',
];

export const getPriorityScore = (accuracy, totalAttempts) => {
    return (100 - accuracy) * Math.log(totalAttempts + 1);
};

export const getDifficultyLevel = (cfRating) => {
    if(!cfRating || cfRating < 1200) {
        return 'Easy';
    }
    if(cfRating < 1800) {
        return 'Medium';
    }
    return 'Hard';
};

export const getChallengeDifficulty = (cfRating) => {
    if(!cfRating || cfRating < 1200) {
        return 'Medium';
    }
    if(cfRating < 1800) {
        return 'Hard';
    } 
    return 'Hard';
};

export const processTagStats = (tagStats = {}) => {
    if(!tagStats || Object.keys(tagStats).length === 0) {
        return [];
    }
    const results = [];

    PRIORITY_TAGS.forEach((tag) => {
        if(tagStats[tag] && tagStats[tag].total >= 3) {
            const {total, accepted} = tagStats[tag];
            const accuracy = Math.round((accepted / total) * 100);
            const priorityScore = getPriorityScore(accuracy, total);

            results.push({
                tag: tag,
                name: TAG_MAP[tag] || tag,
                total,
                accepted,
                accuracy,
                priorityScore,
                isWeak: accuracy < 60
            });
        }
    });

    results.sort((a, b) => b.priorityScore - a.priorityScore);

    return results;
};

export const getWeakTopics = (processedTags = []) => {
    return processedTags.filter(t => t.isWeak);
};

export const getStrongTopics = (processedTags = []) => {
    return processedTags.filter(t => !t.isWeak);
};