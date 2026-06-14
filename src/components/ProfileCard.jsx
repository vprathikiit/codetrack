import React from "react";
import '../styles/ProfileCard.css';

function ProfileCard() {
    const mockData = {
        leetcode: {
            username: 'prathk_codes',
            easy: 50,
            medium: 100,
            hard: 30,
            total: 180
        },
        codeforces: {
            username: 'prathik_cf',
            rating: 1420,
            tier: 'Specialist',
            tierColor: '#1e90ff'
        }
    };

    return (
        <div className="profile-card">
            <h2 className="card-title">Profile</h2>

            <div className="profile-grid">

                <div className="platform-box">
                    <div className="platform-header">
                        <span className="platform-name leetcode-color">LeetCode</span>
                        <span className="username">@{mockData.leetcode.username}</span>
                    </div>
                    <div className="lc-stats">
                        <div className="lc-stat easy">
                            <span className="count">{mockData.leetcode.easy}</span>
                            <span className="label">Easy</span>
                        </div>
                        <div className="lc-stat medium">
                            <span className="count">{mockData.leetcode.medium}</span>
                            <span className="label">Medium</span>
                        </div>
                        <div className="lc-stat hard">
                            <span className="count">{mockData.leetcode.hard}</span>
                            <span className="label">Hard</span>
                        </div>
                    </div>
                    <div className="total-solved">
                        Total solved : <strong>{mockData.leetcode.total}</strong>
                    </div>
                </div>

                <div className="platform-box">
                    <div className="platform-header">
                        <span className="platform-name cf-color">Codeforces</span>
                        <span className="username">@{mockData.codeforces.username}</span>
                    </div>
                    <div className="cf-rating-box">
                        <span
                          className="cf-tier"
                          style={{color: mockData.codeforces.tierColor}}
                        >
                          {mockData.codeforces.tier}  
                        </span>
                        <span className="cf-rating">
                            Rating: <strong>{mockData.codeforces.rating}</strong>
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProfileCard;
