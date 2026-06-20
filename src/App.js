import React, { useEffect, useState } from 'react';
import './styles/global.css';
import AuthPage from './pages/AuthPage';
import UsernameForm from './components/UsernameForm';
import ProfileCard from './components/ProfileCard';
import Heatmap from './components/Heatmap';
import RadarChart from './components/RadarChart';
import Leaderboard from './components/Leaderboard';
import Recommendations from './components/Recommendations';
import { fetchLeetCodeData } from './utils/leetcodeAPI';
import { fetchCodeforcesData } from './utils/codeforcesAPI';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    if(savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);

      if(parsedUser.lcUsername || parsedUser.cfUsername) {
        handleSubmit(parsedUser.lcUsername, parsedUser.cfUsername);
      }
    }
  }, []);

  const handleAuthSuccess = (token, user) => {
    setToken(token);
    setUser(user);

    if(user.lcUsername || user.cfUsername) {
      handleSubmit(user.lcUsername, user.cfUsername);
    }
  };

  const handleSubmit = async (lcUsername, cfUsername) => {
    setLoading(true);
    setHasSearched(false);
    setLeetcodeData(null);
    setCodeforcesData(null);

    try {
      const [lcData, cfData] = await Promise.all([
        lcUsername ? fetchLeetCodeData(lcUsername) : Promise.resolve(null),
        cfUsername ? fetchCodeforcesData(cfUsername) : Promise.resolve(null)
      ]);

      if(lcData) {
        setLeetcodeData(lcData);
      }

      else if(lcUsername) {
        setLeetcodeData({username: lcUsername, error: true});
      }

      if(cfData) {
        setCodeforcesData(cfData);
      }

      else if(cfUsername) {
        setCodeforcesData({username: cfUsername, error: true});
      }

    }
    catch (err) {
      console.error('handleSubmit error:', err);
    }

    setHasSearched(true);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setLeetcodeData(null);
    setCodeforcesData(null);
    setHasSearched(false);
  };

  if(!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <div className="dashboard-header">
        <div>
          <h1>CodeTrack 🚀</h1>
          <p className="subtitle">Your unified coding progress dashboard</p>
        </div>
        <div className="header-right">
          <span className="user-email">
            {user.isGuest ? '👀 Guest' : user.email}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <UsernameForm 
        onSubmit={handleSubmit}
        loading={loading} 
        token={token}
        initialLc={user.lcUsername || ''}
        initialCf={user.cfUsername || ''}
      />

      {loading && (
        <div className='loading-banner'>
          ⏳ Fetching your data from LeetCode and Codeforces...
        </div>
      )}

      {hasSearched && !loading && (
        <>
          <ProfileCard
            leetcodeData={leetcodeData}
            codeforcesData={codeforcesData}
          />
          <Heatmap 
            lcCalendar={leetcodeData?.submissionCalendar ?? {}}
            cfCalendar={codeforcesData?.submissionCalendar ?? {}}
          />
          <RadarChart 
            tagStats={codeforcesData?.tagStats ?? {}}
          />
          <Recommendations
            tagStats={codeforcesData?.tagStats ?? {}}
          />
          <Leaderboard />
        </>
      )}
    </div>
  );
}

export default App;