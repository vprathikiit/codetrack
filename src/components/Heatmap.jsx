import React, { useState } from "react";
import '../styles/Heatmap.css';
import { mergeCalendars } from "../utils/dateUtils";

const TIME_RANGES = [
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: '180 days', days: 180 },
  { label: '365 days', days: 365 },
];

const COLORS = {
  combined: ['#21262d', '#0e4429', '#006d32', '#26a641', '#39d353'],
  leetcode: ['#21262d', '#2b2110', '#5e4200', '#b37a00', '#ffa116'],
  codeforces: ['#21262d', '#0b1b2b', '#163a5c', '#2d5ca3', '#58a6ff'],
};

const toLocalMidnight = (ts) => {
  const date = new Date(Number(ts) * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

function Heatmap({ lcCalendar, cfCalendar }) {
  const [mode, setMode] = useState('combined');
  const [timeRange, setTimeRange] = useState(365);
  const [tooltip, setTooltip] = useState(null);

  const getAllDays = () => {
    const days = [];
    const today = new Date();

    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      days.push({
        dateStr: date.toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        timestamp: Math.floor(date.getTime() / 1000)
      });
    }

    return days;
  };

  const days = getAllDays();

  const getDisplayCalendar = () => {
    const toLocal = (cal) => {
      const result = {};
      Object.entries(cal || {}).forEach(([ts, count]) => {
        const day = toLocalMidnight(ts);
        result[day] = (result[day] || 0) + count;
      });
      return result;
    };

    if (mode === 'leetcode') return toLocal(lcCalendar);
    if (mode === 'codeforces') return toLocal(cfCalendar);
    return mergeCalendars(lcCalendar, cfCalendar);
  };

  const displayCalendar = getDisplayCalendar();

  const getColor = (count) => {
    const palette = COLORS[mode];
    if (!count || count === 0) return palette[0];
    if (count <= 2) return palette[1];
    if (count <= 4) return palette[2];
    if (count <= 6) return palette[3];
    return palette[4];
  };

  const getTotalSubmissions = () =>
    Object.values(displayCalendar).reduce((a, b) => a + b, 0);

  const getActiveDays = () =>
    Object.values(displayCalendar).filter(v => v > 0).length;

  const getMonthLabels = () => {
    const labels = [];
    let lastMonth = -1;
    days.forEach((day, index) => {
      const date = new Date(day.timestamp * 1000);
      const month = date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          index,
          label: date.toLocaleDateString('en-US', { month: 'short' })
        });
        lastMonth = month;
      }
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  const handleMouseEnter = (day, e) => {
    const count = displayCalendar[day.timestamp] || 0;

    const lcCount = Object.entries(lcCalendar || {}).reduce((sum, [ts, c]) => {
      return toLocalMidnight(ts) === day.timestamp ? sum + c : sum;
    }, 0);

    const cfCount = Object.entries(cfCalendar || {}).reduce((sum, [ts, c]) => {
      return toLocalMidnight(ts) === day.timestamp ? sum + c : sum;
    }, 0);

    setTooltip({
      dateStr: day.dateStr,
      total: count,
      lcCount,
      cfCount,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="heatmap-card">
      <div className="heatmap-header">
        <h2 className="card-title">Activity — Last {timeRange} Days</h2>
        <div className="heatmap-controls">
          <div className="heatmap-stats">
            <span className="heatmap-stat">
              <strong>{getTotalSubmissions()}</strong> submissions
            </span>
            <span className="heatmap-stat">
              <strong>{getActiveDays()}</strong> active days
            </span>
          </div>
        </div>
      </div>

      <div className="heatmap-toolbar">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'combined' ? 'active combined' : ''}`}
            onClick={() => setMode('combined')}
          >
            ⚪ Combined
          </button>
          <button
            className={`mode-btn ${mode === 'leetcode' ? 'active leetcode' : ''}`}
            onClick={() => setMode('leetcode')}
          >
            🟡 LeetCode
          </button>
          <button
            className={`mode-btn ${mode === 'codeforces' ? 'active codeforces' : ''}`}
            onClick={() => setMode('codeforces')}
          >
            🔵 Codeforces
          </button>
        </div>

        <div className="time-range-toggle">
          {TIME_RANGES.map((range) => (
            <button
              key={range.days}
              className={`range-btn ${timeRange === range.days ? 'active' : ''}`}
              onClick={() => setTimeRange(range.days)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wrap both in a scrollable container */}
<div className="heatmap-wrapper">
  <div className="month-labels">
    {monthLabels.map((m) => (
      <span
        key={m.index}
        className="month-label"
        style={{ gridColumnStart: Math.floor(m.index / 7) + 1 }}
      >
        {m.label}
      </span>
    ))}
  </div>

  <div className="heatmap-grid">
    {days.map((day, index) => {
      const count = displayCalendar[day.timestamp] || 0;
      return (
        <div
          key={index}
          className="heatmap-cell"
          style={{ backgroundColor: getColor(count) }}
          onMouseEnter={(e) => handleMouseEnter(day, e)}
          onMouseLeave={handleMouseLeave}
        />
      );
    })}
  </div>
</div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span>Less</span>
        {COLORS[mode].map((color, i) => (
          <div key={i} className="legend-cell" style={{ backgroundColor: color }} />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ top: tooltip.y - 110, left: tooltip.x - 80 }}
        >
          <div className="tooltip-date">{tooltip.dateStr}</div>
          {tooltip.total === 0 ? (
            <div className="tooltip-none">No submissions</div>
          ) : mode === 'combined' ? (
            <>
              <div className="tooltip-row">🟡 LeetCode: {tooltip.lcCount}</div>
              <div className="tooltip-row">🔵 Codeforces: {tooltip.cfCount}</div>
              <div className="tooltip-total">Total: {tooltip.total}</div>
            </>
          ) : mode === 'leetcode' ? (
            <div className="tooltip-row">🟡 LeetCode: {tooltip.lcCount}</div>
          ) : (
            <div className="tooltip-row">🔵 Codeforces: {tooltip.cfCount}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Heatmap;