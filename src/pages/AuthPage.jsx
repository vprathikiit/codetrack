import React, { useState } from 'react';
import '../styles/AuthPage.css';
import { signupAPI, loginAPI } from '../utils/authAPI';

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lcUsername, setLcUsername] = useState('');
  const [cfUsername, setCfUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      let data;

      if (mode === 'signup') {
        data = await signupAPI(email, password, lcUsername, cfUsername);
      } else {
        data = await loginAPI(email, password);
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      onAuthSuccess(data.token, data.user);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleGuestLogin = () => {
    onAuthSuccess(null, {
      email: 'guest',
      lcUsername: 'neal_wu',
      cfUsername: 'tourist',
      isGuest: true
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">CodeTrack 🚀</h1>
          <p className="auth-subtitle">Your unified coding progress dashboard</p>
        </div>

        <div className="auth-toggle">
          <button
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {mode === 'signup' && (
            <>
              <div className="auth-input-group">
                <label className="auth-label leetcode-color">
                  LeetCode Username
                </label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="e.g. neal_wu"
                  value={lcUsername}
                  onChange={(e) => setLcUsername(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label cf-color">
                  Codeforces Username
                </label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="e.g. tourist"
                  value={cfUsername}
                  onChange={(e) => setCfUsername(e.target.value)}
                />
              </div>
            </>
          )}

          {error && (
            <div className="auth-error">❌ {error}</div>
          )}

          <button
            className="auth-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login' ? 'Login' : 'Create Account'
            }
          </button>

          <div className="auth-divider">or</div>

          <button
            className="auth-btn-guest"
            onClick={handleGuestLogin}
          >
            👀 Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;