import React, {useState} from "react";
import '../styles/UsernameForm.css';
import { updateUsernameAPI } from "../utils/authAPI";

function UsernameForm({onSubmit, loading, token, initialLc, initialCf}) {
    const [lcUsername, setLcUsername] = useState(initialLc || '');
    const [cfUsername, setCfUsername] = useState(initialCf || '');

    const handleSubmit = async() => {
        if(!lcUsername.trim() && !cfUsername.trim()) {
            return;
        }
        if(token) {
            await updateUsernameAPI(token, lcUsername.trim(), cfUsername.trim());
        }

        onSubmit(lcUsername.trim(), cfUsername.trim());
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
            </div>
        </div>
    );
}

export default UsernameForm;