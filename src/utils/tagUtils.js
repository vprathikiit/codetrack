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
    'data structures'
];

export const processTagStats = (tagStats = {}) => {
    if(!tagStats || Object.keys(tagStats).length === 0) {
        return [];
    }
    const results = [];

    PRIORITY_TAGS.forEach((tag) => {
        if(tagStats[tag] && tagStats[tag].total >= 3) {
            const {total, accepted} = tagStats[tag];
            const accuracy = Math.round((accepted / total) * 100);

            results.push({
                tag: tag,
                name: TAG_MAP[tag] || tag,
                total,
                accepted,
                accuracy,
                isWeak: accuracy < 60
            });
        }
    });

    results.sort((a, b) => a.accuracy - b.accuracy);

    return results;
};

export const getWeakTopics = (processedTags = []) => {
    return processedTags.filter(t => t.isWeak);
};

export const getStrongTopics = (processedTags = []) => {
    return processedTags.filter(t => !t.isWeak);
};