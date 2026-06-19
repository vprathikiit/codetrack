import React, { useState } from 'react';
import '../styles/Recommendations.css';
import { processTagStats } from '../utils/tagUtils';

const PROBLEM_BANK = {
  'dp': [
    { name: 'Climbing Stairs', platform: 'LeetCode', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
    { name: 'Coin Change', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
    { name: 'Longest Common Subsequence', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
    { name: 'Maximum Subarray', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { name: 'Knapsack', platform: 'Codeforces', difficulty: 'Medium', url: 'https://codeforces.com/problemset/problem/414/B' },
  ],
  'graphs': [
    { name: 'Number of Islands', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
    { name: 'Course Schedule', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
    { name: 'Clone Graph', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
    { name: 'Dijkstra Roads', platform: 'Codeforces', difficulty: 'Medium', url: 'https://codeforces.com/problemset/problem/20/C' },
  ],
  'trees': [
    { name: 'Maximum Depth of Binary Tree', platform: 'LeetCode', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { name: 'Validate Binary Search Tree', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    { name: 'Binary Tree Level Order Traversal', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  ],
  'greedy': [
    { name: 'Jump Game', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game/' },
    { name: 'Gas Station', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/gas-station/' },
    { name: 'Greedy CF', platform: 'Codeforces', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/670/C' },
  ],
  'binary search': [
    { name: 'Binary Search', platform: 'LeetCode', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
    { name: 'Search in Rotated Sorted Array', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { name: 'Median of Two Sorted Arrays', platform: 'LeetCode', difficulty: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  ],
  'two pointers': [
    { name: 'Two Sum II', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    { name: 'Container With Most Water', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
    { name: '3Sum', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
  ],
  'strings': [
    { name: 'Longest Substring Without Repeating', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { name: 'Valid Anagram', platform: 'LeetCode', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
    { name: 'String CF', platform: 'Codeforces', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/432/C' },
  ],
  'dfs and similar': [
    { name: 'Path Sum', platform: 'LeetCode', difficulty: 'Easy', url: 'https://leetcode.com/problems/path-sum/' },
    { name: 'Word Search', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/' },
    { name: 'Surrounded Regions', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/surrounded-regions/' },
  ],
  'data structures': [
    { name: 'LRU Cache', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/lru-cache/' },
    { name: 'Min Stack', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/min-stack/' },
    { name: 'Implement Queue using Stacks', platform: 'LeetCode', difficulty: 'Easy', url: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
  ],
  'math': [
    { name: 'Reverse Integer', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/reverse-integer/' },
    { name: 'Pow(x,n)', platform: 'LeetCode', difficulty: 'Medium', url: 'https://leetcode.com/problems/powx-n/' },
    { name: 'Math CF', platform: 'Codeforces', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/1/A' },
  ],
};

function Recommendations({ tagStats }) {
  const [recommendations, setRecommendations] = useState([]);
  const [generated, setGenerated] = useState(false);

  const generateRecommendations = () => {
    const processedTags = processTagStats(tagStats);
    const weakTopics = processedTags.filter(t => t.isWeak);

    const targetTags = weakTopics.length > 0 ? weakTopics : processedTags;
    if (targetTags.length === 0) return;

    const picked = [];

    for (const topic of targetTags) {
      if (picked.length >= 3) break;
      const bank = PROBLEM_BANK[topic.tag];
      if (!bank) continue;

      const random = bank[Math.floor(Math.random() * bank.length)];
      const alreadyPicked = picked.find(p => p.name === random.name);
      if (!alreadyPicked) {
        picked.push({ ...random, reason: topic.name, accuracy: topic.accuracy });
      }
    }

    setRecommendations(picked);
    setGenerated(true);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return '#3fb950';
    if (difficulty === 'Medium') return '#ffa116';
    return '#f85149';
  };

  return (
    <div className="recommendations-card">
      <div className="rec-header">
        <h2 className="card-title">Personalized Recommendations</h2>
        <button className="btn-generate" onClick={generateRecommendations}>
          🎯 Get 3 Problems
        </button>
      </div>

      {!generated && (
        <p className="rec-placeholder">
          Click "Get 3 Problems" to get curated problems targeting your weak topics.
        </p>
      )}

      {generated && recommendations.length === 0 && (
        <p className="rec-placeholder">
          No recommendations available. Add a Codeforces username first.
        </p>
      )}

      {generated && recommendations.length > 0 && (
        <div className="rec-list">
          {recommendations.map((prob, index) => (
            <a
              key={index}
              href={prob.url}
              target="_blank"
              rel="noreferrer"
              className="rec-item"
            >
              <div className="rec-left">
                <span className="rec-number">#{index + 1}</span>
                <div className="rec-info">
                  <span className="rec-name">{prob.name}</span>
                  <span className="rec-reason">
                    Targets your weak area: <strong>{prob.reason}</strong> ({prob.accuracy}% accuracy)
                  </span>
                </div>
              </div>
              <div className="rec-right">
                <span
                  className="rec-difficulty"
                  style={{ color: getDifficultyColor(prob.difficulty) }}
                >
                  {prob.difficulty}
                </span>
                <span className="rec-platform">{prob.platform}</span>
                <span className="rec-arrow">→</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;