import React, { useState } from 'react';
import './styles/global.css';
import UsernameForm from './components/UsernameForm';
import ProfileCard from './components/ProfileCard';
import Heatmap from './components/Heatmap';
import RadarChart from './components/RadarChart';
import Leaderboard from './components/Leaderboard';
import { fetchLeetCodeData } from './utils/leetcodeAPI';

function App() {
  const [loading, setLoading] = useState(false);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (lcUsername, cfUsername) => {
    setLoading(true);
    setHasSearched(false);

    try {
      if (lcUsername) {
        const lcData = await fetchLeetCodeData(lcUsername);
        console.log('Setting leetcode data:', lcData);
        setLeetcodeData(lcData);
      }

      if (cfUsername) {
        setCodeforcesData({
          username: cfUsername,
          tier: 'Coming later',
          rating: '...',
          tierColor: '#8b949e'
        });
      }
    } catch (err) {
      console.error('handleSubmit error:', err);
    }

    setHasSearched(true);
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="dashboard-header">
        <h1>CodeTrack 🚀</h1>
        <p className="subtitle">Your unified coding progress dashboard</p>
      </div>

      <UsernameForm onSubmit={handleSubmit} loading={loading} />

      {hasSearched && (
        <>
          <ProfileCard
            leetcodeData={leetcodeData}
            codeforcesData={codeforcesData}
          />
          <Heatmap />
          <RadarChart />
          <Leaderboard />
        </>
      )}
    </div>
  );
}

export default App;