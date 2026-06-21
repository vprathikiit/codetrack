import React, { useState, useEffect } from 'react';
import '../styles/GoalTracker.css';
import { saveGoalsAPI } from '../utils/goalsAPI';
import { mergeCalendars } from '../utils/dateUtils';

function GoalTracker({ token, lcCalendar, cfCalendar, initialDailyGoal, initialWeeklyGoal }) {
  const [dailyGoal, setDailyGoal] = useState(initialDailyGoal || 5);
  const [weeklyGoal, setWeeklyGoal] = useState(initialWeeklyGoal || 20);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialDailyGoal) setDailyGoal(initialDailyGoal);
    if (initialWeeklyGoal) setWeeklyGoal(initialWeeklyGoal);
  }, [initialDailyGoal, initialWeeklyGoal]);

  const getTodayCount = () => {
    const merged = mergeCalendars(lcCalendar, cfCalendar);
    const today = new Date();
    const todayTs = Math.floor(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000
    );
    return merged[todayTs] || 0;
  };

  const getWeekCount = () => {
    const merged = mergeCalendars(lcCalendar, cfCalendar);
    const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
    let count = 0;
    Object.entries(merged).forEach(([ts, c]) => {
      if (Number(ts) >= oneWeekAgo) {
        count += c;
      }
    });
    return count;
  };

  const todayCount = getTodayCount();
  const weekCount = getWeekCount();

  const dailyProgress = Math.min(100, Math.round((todayCount / dailyGoal) * 100));
  const weeklyProgress = Math.min(100, Math.round((weekCount / weeklyGoal) * 100));

  const dailyDone = todayCount >= dailyGoal;
  const weeklyDone = weekCount >= weeklyGoal;

  const handleSave = async () => {
    if (!token) {
        return;
    }
    setSaving(true);
    try {
      await saveGoalsAPI(token, dailyGoal, weeklyGoal);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } 
    catch (err) {
      console.error('Failed to save goals:', err);
    }
    setSaving(false);
  };

  const ProgressBar = ({ progress, done }) => (
    <div className="goal-bar-track">
      <div
        className={`goal-bar-fill ${done ? 'complete' : ''}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <div className="goal-card">
      <div className="goal-header">
        <h2 className="card-title">🎯 Daily Goal Tracker</h2>
        <button
          className="btn-edit-goals"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : '✏️ Edit Goals'}
        </button>
      </div>

      {editing && (
        <div className="goal-edit-form">
          <div className="goal-edit-row">
            <div className="goal-edit-group">
              <label className="goal-edit-label">Daily Goal (submissions)</label>
              <input
                className="goal-edit-input"
                type="number"
                min="1"
                max="100"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
              />
            </div>
            <div className="goal-edit-group">
              <label className="goal-edit-label">Weekly Goal (submissions)</label>
              <input
                className="goal-edit-input"
                type="number"
                min="1"
                max="500"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            className="btn-save-goals"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Goals'}
          </button>
        </div>
      )}

      <div className="goal-progress-grid">

        <div className={`goal-box ${dailyDone ? 'complete' : ''}`}>
          <div className="goal-box-header">
            <span className="goal-box-title">Today</span>
            {dailyDone && <span className="goal-complete-badge">🎉 Done!</span>}
          </div>
          <div className="goal-counts">
            <span className="goal-current">{todayCount}</span>
            <span className="goal-separator">/</span>
            <span className="goal-target">{dailyGoal}</span>
            <span className="goal-unit">submissions</span>
          </div>
          <ProgressBar progress={dailyProgress} done={dailyDone} />
          <div className="goal-percent">{dailyProgress}% complete</div>
        </div>

        <div className={`goal-box ${weeklyDone ? 'complete' : ''}`}>
          <div className="goal-box-header">
            <span className="goal-box-title">This Week</span>
            {weeklyDone && <span className="goal-complete-badge">🎉 Done!</span>}
          </div>
          <div className="goal-counts">
            <span className="goal-current">{weekCount}</span>
            <span className="goal-separator">/</span>
            <span className="goal-target">{weeklyGoal}</span>
            <span className="goal-unit">submissions</span>
          </div>
          <ProgressBar progress={weeklyProgress} done={weeklyDone} />
          <div className="goal-percent">{weeklyProgress}% complete</div>
        </div>

      </div>

      <div className="goal-remaining">
        {!dailyDone && (
          <span className="remaining-msg">
            📌 {dailyGoal - todayCount} more submission{dailyGoal - todayCount !== 1 ? 's' : ''} to hit today's goal
          </span>
        )}
        {!weeklyDone && (
          <span className="remaining-msg">
            📌 {weeklyGoal - weekCount} more submission{weeklyGoal - weekCount !== 1 ? 's' : ''} to hit weekly goal
          </span>
        )}
      </div>
    </div>
  );
}

export default GoalTracker;