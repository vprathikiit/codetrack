import React from "react";
import '../styles/ProfileCard.css';

function ProfileCard({leetcodeData, codeforcesData}) {
    if(!leetcodeData && !codeforcesData) {
        return (
            <div className="profile-card empty-state">
                <p>Enter your usernames above to see your profile ☝️</p>
            </div>
        );
    }

    return (
        <div className="profile-card">
            <h2 className="card-title">Profile</h2>

            <div className="profile-grid">
              {leetcodeData && (
                <div className="platform-box">
                    <div className="platform-header">
                        <span className="platform-name leetcode-color">LeetCode</span>
                        <span className="username">@{leetcodeData.username}</span>
                    </div>
                    {leetcodeData.error ? (
                        <p className="error-text">User not found</p>
                    ) : (
                    <>
                    <div className="lc-stats">
                        <div className="lc-stat easy">
                            <span className="count">{leetcodeData.easy}</span>
                            <span className="label">Easy</span>
                        </div>
                        <div className="lc-stat medium">
                            <span className="count">{leetcodeData.medium}</span>
                            <span className="label">Medium</span>
                        </div>
                        <div className="lc-stat hard">
                            <span className="count">{leetcodeData.hard}</span>
                            <span className="label">Hard</span>
                        </div>
                    </div>
                    <div className="total-solved">
                        Total solved : <strong>{leetcodeData.total}</strong>
                    </div>
                    <div className="total-solved">
                        Ranking : <strong>#{leetcodeData.ranking}</strong>
                    </div>
                    </>
                    )}
                </div>
              )}

               {codeforcesData && (
                <div className="platform-box">
                    <div className="platform-header">
                        <span className="platform-name cf-color">Codeforces</span>
                        <span className="username">@{codeforcesData.username}</span>
                    </div>
                    {codeforcesData.error ? (
                        <p className="error-text">User not found</p>
                    ) : (
                    <>    
                    <div className="cf-rating-box">
                        <span
                          className="cf-tier"
                          style={{color: codeforcesData.tierColor}}
                        >
                          {codeforcesData.tier}  
                        </span>
                        <div className="cf-rating-row">
                            <span className="cf-rating">
                                Current : <strong>{codeforcesData.rating}</strong>
                            </span>
                            <span className="cf-rating">
                                Peak : <strong>{codeforcesData.maxRating}</strong>
                            </span>
                        </div>
                        {codeforcesData.country && (
                            <span className="cf-country">
                                📍 {codeforcesData.country}
                            </span>
                        )}
                    </div>
                    <div className="total-solved">
                        Total submissions : <strong>{codeforcesData.totalSubmissions}</strong>
                    </div>
                    </>
                   )} 
                </div>
              )}
              
            </div>
        </div>
    );
}

export default ProfileCard;
