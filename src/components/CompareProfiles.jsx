import React, { useState } from 'react';
import '../styles/CompareProfiles.css';
import { fetchLeetCodeData } from '../utils/leetcodeAPI';
import { fetchCodeforcesData } from '../utils/codeforcesAPI';
import {
  calculateLifetimeXP,
  calculateWeeklyXP,
  calculateStreak,
  getLevelProgress
} from '../utils/xpSystem';
import { processTagStats } from '../utils/tagUtils';

function CompareProfiles({ myLcData, myCfData }) {
  const [oppLcUsername, setOppLcUsername] = useState('');
  const [oppCfUsername, setOppCfUsername] = useState('');
  const [oppLcData, setOppLcData] = useState(null);
  const [oppCfData, setOppCfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compared, setCompared] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!oppLcUsername.trim() && !oppCfUsername.trim()) {
      setError('Enter at least one username to compare');
      return;
    }
    setLoading(true);
    setError('');
    setCompared(false);

    try {
      const [lcData, cfData] = await Promise.all([
        oppLcUsername.trim()
          ? fetchLeetCodeData(oppLcUsername.trim())
          : Promise.resolve(null),
        oppCfUsername.trim()
          ? fetchCodeforcesData(oppCfUsername.trim())
          : Promise.resolve(null)
      ]);

      setOppLcData(lcData);
      setOppCfData(cfData);
      setCompared(true);
    } 
    catch (err) {
      setError('Failed to fetch opponent data');
    }

    setLoading(false);
  };

  const getStats = (lcData, cfData) => {
    const lifetimeXP = calculateLifetimeXP(lcData, cfData);
    const weeklyXP = calculateWeeklyXP(lcData, cfData);
    const { currentStreak, bestStreak } = calculateStreak(
      lcData?.submissionCalendar ?? {},
      cfData?.submissionCalendar ?? {}
    );
    const { level, progress } = getLevelProgress(lifetimeXP);
    const tags = processTagStats(cfData?.tagStats ?? {});

    return {
      lcSolved: lcData?.total ?? null,
      lcEasy: lcData?.easy ?? null,
      lcMedium: lcData?.medium ?? null,
      lcHard: lcData?.hard ?? null,
      cfRating: cfData?.rating ?? null,
      cfTier: cfData?.tier ?? null,
      cfTierColor: cfData?.tierColor ?? '#8b949e',
      lifetimeXP,
      weeklyXP,
      level,
      progress,
      currentStreak,
      bestStreak,
      tags
    };
  };

  const myStats = getStats(myLcData, myCfData);
  const oppStats = compared ? getStats(oppLcData, oppCfData) : null;

  const getCommonTags = () => {
    if (!oppStats) {
        return [];
    }
    const myTagNames = myStats.tags.map(t => t.tag);
    const oppTagNames = oppStats.tags.map(t => t.tag);
    const common = myTagNames.filter(t => oppTagNames.includes(t));
    return common.slice(0, 6);
  };

  const commonTags = getCommonTags();

  const renderValue = (value, suffix = '') => {
    if (value === null || value === undefined) {
        return '—';
    }
    return `${value}${suffix}`;
  };

  const getWinner = (myVal, oppVal, higherIsBetter = true) => {
    if (myVal === null || oppVal === null) {
        return 'none';
    }
    if (higherIsBetter) {
      if (myVal > oppVal) {
        return 'me';
      }
      if (oppVal > myVal) {
        return 'opp';
      }
    } else {
      if (myVal < oppVal) {
        return 'me';
      }
      if (oppVal < myVal) {
        return 'opp';
      }
    }
    return 'tie';
  };

  const StatRow = ({ label, myVal, oppVal, suffix = '', higherIsBetter = true }) => {
    const winner = getWinner(myVal, oppVal, higherIsBetter);
    return (
      <tr className="stat-row">
        <td className={`stat-value ${winner === 'me' ? 'winner' : ''}`}>
          {renderValue(myVal, suffix)}
          {winner === 'me' && <span className="win-badge">✓</span>}
        </td>
        <td className="stat-label">{label}</td>
        <td className={`stat-value ${winner === 'opp' ? 'winner' : ''}`}>
          {renderValue(oppVal, suffix)}
          {winner === 'opp' && <span className="win-badge">✓</span>}
        </td>
      </tr>
    );
  };

  return (
    <div className="compare-card">
      <h2 className="card-title">🆚 Compare Profiles</h2>

      <div className="compare-form">
        <div className="compare-inputs">
          <div className="compare-input-group">
            <label className="compare-label leetcode-color">
              Opponent LeetCode
            </label>
            <input
              className="compare-input"
              type="text"
              placeholder="e.g. neal_wu (optional)"
              value={oppLcUsername}
              onChange={(e) => setOppLcUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            />
          </div>
          <div className="compare-input-group">
            <label className="compare-label cf-color">
              Opponent Codeforces
            </label>
            <input
              className="compare-input"
              type="text"
              placeholder="e.g. tourist (optional)"
              value={oppCfUsername}
              onChange={(e) => setOppCfUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            />
          </div>
        </div>
        {error && <p className="compare-error">❌ {error}</p>}
        <button
          className="btn-compare"
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? '⏳ Fetching...' : '🆚 Compare'}
        </button>
      </div>

      {compared && oppStats && (
        <div className="compare-result">

          <div className="compare-headers">
            <div className="compare-user me">
              <div className="compare-username">
                {myLcData?.username || myCfData?.username || 'You'}
              </div>
              <div className="compare-level">⭐ Level {myStats.level}</div>
            </div>
            <div className="compare-vs">VS</div>
            <div className="compare-user opp">
              <div className="compare-username">
                {oppLcData?.username || oppCfData?.username || 'Opponent'}
              </div>
              <div className="compare-level">⭐ Level {oppStats.level}</div>
            </div>
          </div>

          <table className="compare-table">
            <tbody>
              <tr className="section-header">
                <td colSpan="3">📊 Overall</td>
              </tr>
              <StatRow
                label="Total XP"
                myVal={myStats.lifetimeXP}
                oppVal={oppStats.lifetimeXP}
              />
              <StatRow
                label="Weekly XP"
                myVal={myStats.weeklyXP}
                oppVal={oppStats.weeklyXP}
              />
              <StatRow
                label="🔥 Streak"
                myVal={myStats.currentStreak}
                oppVal={oppStats.currentStreak}
                suffix=" days"
              />
              <StatRow
                label="Best Streak"
                myVal={myStats.bestStreak}
                oppVal={oppStats.bestStreak}
                suffix=" days"
              />

              <tr className="section-header">
                <td colSpan="3">🟡 LeetCode</td>
              </tr>
              <StatRow
                label="Total Solved"
                myVal={myStats.lcSolved}
                oppVal={oppStats.lcSolved}
              />
              <StatRow
                label="Easy"
                myVal={myStats.lcEasy}
                oppVal={oppStats.lcEasy}
              />
              <StatRow
                label="Medium"
                myVal={myStats.lcMedium}
                oppVal={oppStats.lcMedium}
              />
              <StatRow
                label="Hard"
                myVal={myStats.lcHard}
                oppVal={oppStats.lcHard}
              />

              <tr className="section-header">
                <td colSpan="3">🔵 Codeforces</td>
              </tr>
              <StatRow
                label="CF Rating"
                myVal={myStats.cfRating}
                oppVal={oppStats.cfRating}
              />

              {commonTags.length > 0 && (
                <>
                  <tr className="section-header">
                    <td colSpan="3">🧠 Topic Accuracy</td>
                  </tr>
                  {commonTags.map((tag) => {
                    const myTag = myStats.tags.find(t => t.tag === tag);
                    const oppTag = oppStats.tags.find(t => t.tag === tag);
                    return (
                      <tr key={tag} className="tag-compare-row">
                        <td>
                          <div className="tag-bar-wrapper">
                            <span className={`tag-val ${myTag?.accuracy >= (oppTag?.accuracy || 0) ? 'winner' : ''}`}>
                              {myTag?.accuracy ?? '—'}%
                            </span>
                            <div className="tag-bar-track">
                              <div
                                className="tag-bar-fill me"
                                style={{ width: `${myTag?.accuracy || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="stat-label">{myTag?.name || tag}</td>
                        <td>
                          <div className="tag-bar-wrapper reverse">
                            <div className="tag-bar-track">
                              <div
                                className="tag-bar-fill opp"
                                style={{ width: `${oppTag?.accuracy || 0}%` }}
                              />
                            </div>
                            <span className={`tag-val ${oppTag?.accuracy >= (myTag?.accuracy || 0) ? 'winner' : ''}`}>
                              {oppTag?.accuracy ?? '—'}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>

          <div className="winner-summary">
            {(() => {
              const myWins = [
                myStats.lifetimeXP > oppStats.lifetimeXP,
                myStats.weeklyXP > oppStats.weeklyXP,
                myStats.currentStreak > oppStats.currentStreak,
                (myStats.lcSolved || 0) > (oppStats.lcSolved || 0),
                (myStats.cfRating || 0) > (oppStats.cfRating || 0)
              ].filter(Boolean).length;

              const oppWins = 5 - myWins;

              if (myWins > oppWins) {
                return <div className="winner-msg me">🏆 You're ahead overall!</div>;
              } else if (oppWins > myWins) {
                return <div className="winner-msg opp">💪 Keep grinding — they're ahead for now!</div>;
              } else {
                return <div className="winner-msg tie">🤝 It's a tie — well matched!</div>;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareProfiles;