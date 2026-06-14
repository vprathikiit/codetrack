import React from "react";
import '../styles/Leaderboard.css';

function Leaderboard() {
    const mockPlayers = [
      {rank: 1, name: 'Priya Sharma', leetcode: 32, codeforces: 18, points: 186 },
      {rank: 2, name: 'Rahul Verma', leetcode: 28, codeforces: 15, points: 159 },
      {rank: 3, name: 'Aditya Kumar', leetcode: 25, codeforces: 12, points: 135 },
      {rank: 4, name: 'Sneha Patel', leetcode: 20, codeforces: 10, points: 110 },
      {rank: 5, name: 'You', leetcode: 18, codeforces: 8, points: 94, isYou: true },
    ];

    return (
        <div className="leaderboard-card">
            <div className="leaderboard-header">
                <h2 className="card-title">ISM Dhanbad - Batch 2028</h2>
                <span className="week-label">This Week</span>
            </div>
            <table className="lb-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>LC Solved</th>
                        <th>CF Solved</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {mockPlayers.map((player) => (
                        <tr key={player.rank} className={player.isYou ? 'your-row' : ''}>
                            <td className="rank-cell">
                                {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                            </td>
                            <td>{player.name}</td>
                            <td>{player.leetcode}</td>
                            <td>{player.codeforces}</td>
                            <td className="points-cell">{player.points} pts</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;