import React, {useState} from "react";
import '../styles/UsernameForm.css';

function UsernameForm({onSubmit, loading}) {
    const [lcUsername, setLcUsername] = useState('');
    const [cfUsername, setCfUsername] = useState('');

    const handleSubmit = () => {
        if(!lcUsername.trim() && !cfUsername.trim()) {
            return;
        }
        onSubmit(lcUsername.trim(), cfUsername.trim());
    };

    const handleGuestLogin = () => {
        onSubmit('neal_wu', 'tourist');
    };

    return (
        <div className="form-card">
            <h2 className="form-title">Enter Your Username</h2>
            <div className="form-row">
                <div className="input-group">
                    <label className="input-label leetcode-color">LeetCode Username</label>
                    <input
                      className="username-input"
                      type="text"
                      placeholder="e.g. neal_wu"
                      value={lcUsername}
                      onChange={(e) => setLcUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label cf-color">Codeforces Username</label>
                    <input
                      className="username-input"
                      type="text"
                      placeholder="e.g. tourist"
                      value={cfUsername}
                      onChange={(e) => setCfUsername(e.target.value)}
                    />
                </div>
            </div>
            <div className="form-buttons">
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                    {loading ? 'Loading...' : 'Track My Progress 🚀'}
                </button>
                <button 
                  className="btn-guest"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                    👀 Login as Guest
                </button>
            </div>
        </div>
    );
}

export default UsernameForm;