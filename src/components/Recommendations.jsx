import React, { useState } from 'react';
import '../styles/Recommendations.css';
import { processTagStats } from '../utils/tagUtils';
import { getProblemsForDifficulty, getProblemsForTag } from '../utils/problemBank';

const getDifficultyLevel = (cfRating) => {
  if (!cfRating || cfRating < 1200) return 'Easy';
  if (cfRating < 1800) return 'Medium';
  return 'Hard';
};

const getChallengeDifficulty = (cfRating) => {
  if (!cfRating || cfRating < 1200) return 'Medium';
  if (cfRating < 1800) return 'Hard';
  return 'Hard';
};

const pickRandom = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

function Recommendations({ tagStats, cfRating }) {
  const [recommendations, setRecommendations] = useState([]);
  const [generated, setGenerated] = useState(false);

  const generateRecommendations = () => {
    const processedTags = processTagStats(tagStats);
    if (processedTags.length === 0) return;

    const userDifficulty = getDifficultyLevel(cfRating);
    const challengeDifficulty = getChallengeDifficulty(cfRating);

    const weakTopics = processedTags.filter(t => t.isWeak);
    const strongTopics = processedTags.filter(t => !t.isWeak);

    const picked = [];

    if (weakTopics.length >= 1) {
      const topic = weakTopics[0];
      let problems = getProblemsForDifficulty(topic.tag, userDifficulty);
      if (problems.length === 0) problems = getProblemsForTag(topic.tag);
      const problem = pickRandom(problems);
      if (problem) {
        picked.push({
          ...problem,
          slot: 'fix',
          slotLabel: '🎯 Fix immediately',
          reason: topic.name,
          accuracy: topic.accuracy
        });
      }
    }

    if (weakTopics.length >= 2) {
      const topic = weakTopics[1];
      let problems = getProblemsForDifficulty(topic.tag, userDifficulty);
      if (problems.length === 0) problems = getProblemsForTag(topic.tag);
      const problem = pickRandom(
        problems.filter(p => !picked.find(x => x.name === p.name))
      );
      if (problem) {
        picked.push({
          ...problem,
          slot: 'improve',
          slotLabel: '📈 Improve',
          reason: topic.name,
          accuracy: topic.accuracy
        });
      }
    } 
    
    else if (weakTopics.length === 1 && processedTags.length >= 2) {
      const topic = processedTags[1];
      let problems = getProblemsForDifficulty(topic.tag, userDifficulty);
      if (problems.length === 0) problems = getProblemsForTag(topic.tag);
      const problem = pickRandom(
        problems.filter(p => !picked.find(x => x.name === p.name))
      );
      if (problem) {
        picked.push({
          ...problem,
          slot: 'improve',
          slotLabel: '📈 Improve',
          reason: topic.name,
          accuracy: topic.accuracy
        });
      }
    }

    if (strongTopics.length >= 1) {
      const topic = strongTopics[0];
      let problems = getProblemsForDifficulty(topic.tag, challengeDifficulty);
      if (problems.length === 0) problems = getProblemsForTag(topic.tag);
      const problem = pickRandom(
        problems.filter(p => !picked.find(x => x.name === p.name))
      );
      if (problem) {
        picked.push({
          ...problem,
          slot: 'challenge',
          slotLabel: '🔥 Challenge yourself',
          reason: topic.name,
          accuracy: topic.accuracy
        });
      }
    } else if (processedTags.length >= 3) {
      const topic = processedTags[processedTags.length - 1];
      let problems = getProblemsForDifficulty(topic.tag, challengeDifficulty);
      if (problems.length === 0) problems = getProblemsForTag(topic.tag);
      const problem = pickRandom(
        problems.filter(p => !picked.find(x => x.name === p.name))
      );
      if (problem) {
        picked.push({
          ...problem,
          slot: 'challenge',
          slotLabel: '🔥 Challenge yourself',
          reason: topic.name,
          accuracy: topic.accuracy
        });
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

  const getSlotColor = (slot) => {
    if (slot === 'fix') return '#f85149';
    if (slot === 'improve') return '#ffa116';
    return '#58a6ff';
  };

  return (
    <div className="recommendations-card">
      <div className="rec-header">
        <div>
          <h2 className="card-title">Personalized Recommendations</h2>
          <p className="rec-subtitle">
            Based on your Codeforces topic performance
            {cfRating ? ` · CF Rating ${cfRating}` : ''}
          </p>
        </div>
        <button className="btn-generate" onClick={generateRecommendations}>
          🎯 Get Problems
        </button>
      </div>

      {!generated && (
        <p className="rec-placeholder">
          Click "Get Problems" to get 3 smart recommendations targeting your weak topics.
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
                <div
                  className="rec-slot-badge"
                  style={{ color: getSlotColor(prob.slot) }}
                >
                  {prob.slotLabel}
                </div>
                <div className="rec-info">
                  <span className="rec-name">{prob.name}</span>
                  <span className="rec-reason">
                    Topic: <strong>{prob.reason}</strong> — {prob.accuracy}% accuracy
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