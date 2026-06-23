import React from 'react';
import '../styles/ProfileCard.css';
import {
  calculateLifetimeXP,
  calculateWeeklyXP,
  calculateStreak,
  getLevelProgress,
  getStreakBadge,
  streakBonusXP,
  activityBonusXP
} from '../utils/xpSystem';

function ProfileCard({ leetcodeData, codeforcesData }) {
  if (!leetcodeData && !codeforcesData) {
    return (
      <div className="profile-card empty-state">
        <p>Enter your usernames above to see your profile ☝️</p>
      </div>
    );
  }

  const lifetimeXP = calculateLifetimeXP(leetcodeData, codeforcesData);
  const weeklyXP = calculateWeeklyXP(leetcodeData, codeforcesData);
  const { currentStreak, bestStreak } = calculateStreak(
    leetcodeData?.submissionCalendar ?? {},
    codeforcesData?.submissionCalendar ?? {}
  );
  const { level, progress, xp, nextLevelXP } = getLevelProgress(lifetimeXP);
  const streakBadge = getStreakBadge(currentStreak);
  const streakBonus = streakBonusXP(currentStreak);
  const activityBonus = activityBonusXP(
    leetcodeData?.submissionCalendar ?? {},
    codeforcesData?.submissionCalendar ?? {}
  );

  return (
    <div className="profile-card">
      <h2 className="card-title">Profile</h2>

      <div className="xp-section">
        <div className="xp-header">
          <div className="level-badge">⭐ Level {level}</div>
          <div className="xp-numbers">
            <span className="xp-current">{xp.toLocaleString()} XP</span>
            <span className="xp-divider">/</span>
            <span className="xp-next">{nextLevelXP.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="xp-bar-track">
          <div
            className="xp-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="xp-breakdown">
          <span>Weekly XP: <strong className="weekly-xp">{weeklyXP}</strong></span>
          {streakBonus > 0 && (
            <span>Streak Bonus: <strong className="bonus-xp">+{streakBonus}</strong></span>
          )}
          {activityBonus > 0 && (
            <span>Activity Bonus: <strong className="bonus-xp">+{activityBonus}</strong></span>
          )}
        </div>
      </div>

      <div className="streak-section">
        <div className="streak-item">
          <span className="streak-fire">🔥</span>
          <div className="streak-info">
            <span className="streak-number">{currentStreak}</span>
            <span className="streak-label">Current Streak</span>
          </div>
        </div>
        <div className="streak-divider" />
        <div className="streak-item">
          <span className="streak-fire">🏆</span>
          <div className="streak-info">
            <span className="streak-number">{bestStreak}</span>
            <span className="streak-label">Best Streak</span>
          </div>
        </div>
        {streakBadge && (
          <div className="streak-badge">{streakBadge}</div>
        )}
      </div>

      <div className="profile-grid">

        {leetcodeData && (
          <div className="platform-box">
            <div className="platform-header">
              <span className="platform-name leetcode-color">LeetCode</span>
              <span className="username">@{leetcodeData.username}</span>
            </div>
            {leetcodeData.error ? (
              <div className="error-box">
                <p className="error-text">❌ Failed to load</p>
                <p className="error-hint">Check username or try refreshing</p>
              </div>
            ) : (
              <>
                <div className="lc-stats">
                  <div className="lc-stat easy">
                    <span className="count">{leetcodeData.easy}</span>
                    <span className="label">Easy</span>
                  </div>
                  <div className="lc-stat medium">
                    <span className="count">{leetcodeData.medium}</span>
                    <span className="label">Medium</span>
                  </div>
                  <div className="lc-stat hard">
                    <span className="count">{leetcodeData.hard}</span>
                    <span className="label">Hard</span>
                  </div>
                </div>
                <div className="total-solved">
                  Total: <strong>{leetcodeData.total}</strong>
                  <span className="xp-tag">
                    {(
                      (leetcodeData.easy || 0) * 10 +
                      (leetcodeData.medium || 0) * 25 +
                      (leetcodeData.hard || 0) * 50
                    ).toLocaleString()} XP
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {codeforcesData && (
          <div className="platform-box">
            <div className="platform-header">
              <span className="platform-name cf-color">Codeforces</span>
              <span className="username">@{codeforcesData.username}</span>
            </div>
            {codeforcesData.error ? (
              <div className="error-box">
                <p className="error-text">❌ Failed to load</p>
                <p className="error-hint">Check username or try refreshing</p>
              </div>
            ) : (
              <>
                <div className="cf-rating-box">
                  <span
                    className="cf-tier"
                    style={{ color: codeforcesData.tierColor }}
                  >
                    {codeforcesData.tier}
                  </span>
                  <div className="cf-rating-row">
                    <span className="cf-rating">
                      Current: <strong>{codeforcesData.rating}</strong>
                    </span>
                    <span className="cf-rating">
                      Peak: <strong>{codeforcesData.maxRating}</strong>
                    </span>
                  </div>
                </div>
                <div className="total-solved">
                  Submissions: <strong>{codeforcesData.totalSubmissions}</strong>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfileCard;