import React from 'react';
import './styles/global.css';
import ProfileCard from './components/ProfileCard';
import Heatmap from './components/Heatmap';
import RadarChart from './components/RadarChart';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <div className='app'>
      <div className='dashboard-header'>
        <h1>CodeTrack 🚀</h1>
        <p className='subtitle'>Ypur unified coding platform dashboard</p>
      </div>
      <ProfileCard />
      <Heatmap />
      <RadarChart />
      <Leaderboard />
    </div>
  );
}

export default App;
