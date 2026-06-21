import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import '../styles/ContestTracker.css';
import {
  fetchContests,
  fetchRatingHistory,
  formatDuration,
  formatCountdown
} from '../utils/contestAPI';

function Countdown({ startTime }) {
  const [countdown, setCountdown] = useState(formatCountdown(startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <span className="countdown-timer">{countdown}</span>;
}

const RatingTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }
  const d = payload[0].payload;
  return (
    <div className="rating-tooltip">
      <div className="rt-name">{d.contestName}</div>
      <div className="rt-rating">{d.newRating}</div>
      <div className={`rt-change ${d.ratingChange >= 0 ? 'positive' : 'negative'}`}>
        {d.ratingChange >= 0 ? '+' : ''}{d.ratingChange}
      </div>
      <div className="rt-rank">Rank #{d.rank}</div>
      <div className="rt-date">{d.date}</div>
    </div>
  );
};

function ContestTracker({ cfUsername }) {
  const [contests, setContests] = useState({ upcoming: [], past: [] });
  const [ratingHistory, setRatingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (cfUsername && !loaded) {
      loadData();
    }
  }, [cfUsername]);

  const loadData = async() => {
    setLoading(true);
    try {
      const [contestData, ratingData] = await Promise.all([
        fetchContests(),
        cfUsername ? fetchRatingHistory(cfUsername) : Promise.resolve([])
      ]);
      setContests(contestData);
      setRatingHistory(ratingData);
      setLoaded(true);
    } 
    catch (err) {
      console.error('Contest tracker error:', err);
    }
    setLoading(false);
  };

  if (!cfUsername) {
    return (
      <div className="contest-card empty-state">
        <p>Enter a Codeforces username to see contest history 🏆</p>
      </div>
    );
  }

  const chartData = ratingHistory.slice(-20).map((entry, index) => ({
    ...entry,
    index: index + 1,
    label: `#${index + 1}`
  }));

  const maxRating = Math.max(...chartData.map(d => d.newRating), 0);
  const minRating = Math.min(...chartData.map(d => d.newRating), 9999);

  return (
    <div className="contest-card">
      <div className="contest-header">
        <h2 className="card-title">Contest Tracker</h2>
        <div className="contest-tabs">
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            ⏳ Upcoming
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            🏆 My History
          </button>
          <button
            className={`tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            📈 Rating Graph
          </button>
        </div>
      </div>

      {loading && (
        <div className="contest-loading">⏳ Loading contest data...</div>
      )}

      {!loading && activeTab === 'upcoming' && (
        <div className="upcoming-list">
          {contests.upcoming.length === 0 ? (
            <p className="contest-empty">No upcoming contests found.</p>
          ) : (
            contests.upcoming.map((contest) => (
              <div key={contest.id} className="contest-item">
                <div className="contest-item-left">
                  <div className="contest-name">{contest.name}</div>
                  <div className="contest-meta">
                    Duration: {formatDuration(contest.duration)}
                    <span className="contest-type">{contest.type}</span>
                  </div>
                </div>
                <div className="contest-item-right">
                  <div className="countdown-label">Starts in</div>
                  <Countdown startTime={contest.startTime} />
                  <a
                    href={`https://codeforces.com/contest/${contest.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="contest-link"
                  >
                    Register →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && activeTab === 'history' && (
        <div className="history-list">
          {ratingHistory.length === 0 ? (
            <p className="contest-empty">No contest history found.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Rank</th>
                  <th>Change</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...ratingHistory].reverse().map((entry, index) => (
                  <tr key={index}>
                    <td className="contest-name-cell">
                      <a
                        href={`https://codeforces.com/contest/${entry.contestId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="contest-name-link"
                      >
                        {entry.contestName.length > 35
                          ? entry.contestName.substring(0, 35) + '...'
                          : entry.contestName}
                      </a>
                    </td>
                    <td>#{entry.rank}</td>
                    <td className={entry.ratingChange >= 0 ? 'positive' : 'negative'}>
                      {entry.ratingChange >= 0 ? '+' : ''}{entry.ratingChange}
                    </td>
                    <td className="rating-cell">{entry.newRating}</td>
                    <td className="date-cell">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!loading && activeTab === 'graph' && (
        <div className="rating-graph">
          {chartData.length === 0 ? (
            <p className="contest-empty">No rating history to display.</p>
          ) : (
            <>
              <div className="graph-stats">
                <div className="graph-stat">
                  <span className="gs-label">Peak Rating</span>
                  <span className="gs-value peak">{maxRating}</span>
                </div>
                <div className="graph-stat">
                  <span className="gs-label">Current</span>
                  <span className="gs-value">{chartData[chartData.length - 1]?.newRating}</span>
                </div>
                <div className="graph-stat">
                  <span className="gs-label">Contests</span>
                  <span className="gs-value">{ratingHistory.length}</span>
                </div>
                <div className="graph-stat">
                  <span className="gs-label">Best Rank</span>
                  <span className="gs-value">
                    #{Math.min(...ratingHistory.map(r => r.rank))}
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#21262d" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#8b949e', fontSize: 11 }}
                    axisLine={{ stroke: '#30363d' }}
                  />
                  <YAxis
                    domain={[minRating - 100, maxRating + 100]}
                    tick={{ fill: '#8b949e', fontSize: 11 }}
                    axisLine={{ stroke: '#30363d' }}
                    width={45}
                  />
                  <Tooltip content={<RatingTooltip />} />
                  <ReferenceLine
                    y={1200}
                    stroke="#808080"
                    strokeDasharray="3 3"
                    label={{ value: 'Pupil', fill: '#808080', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={1400}
                    stroke="#008000"
                    strokeDasharray="3 3"
                    label={{ value: 'Specialist', fill: '#008000', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={1600}
                    stroke="#03a89e"
                    strokeDasharray="3 3"
                    label={{ value: 'Expert', fill: '#03a89e', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={1900}
                    stroke="#0000ff"
                    strokeDasharray="3 3"
                    label={{ value: 'CM', fill: '#0000ff', fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newRating"
                    stroke="#58a6ff"
                    strokeWidth={2}
                    dot={{ fill: '#58a6ff', r: 4 }}
                    activeDot={{ r: 6, fill: '#ffa116' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ContestTracker;