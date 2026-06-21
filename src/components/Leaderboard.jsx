import React, { useEffect, useState } from "react";
import '../styles/Leaderboard.css';
import { createRoomAPI, joinRoomAPI, getMyRoomsAPI } from "../utils/roomsAPI";
import { fetchLeetCodeData } from "../utils/leetcodeAPI";
import { fetchCodeforcesData } from "../utils/codeforcesAPI";
import { calculateWeeklyScore, calculateTotalScore } from "../utils/scoring";

function Leaderboard({ token, currentUser }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [mode, setMode] = useState('home');
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
  if (token) loadMyRooms();
  }, [token]);

  const loadMyRooms = async () => {
    try {
      const data = await getMyRoomsAPI(token);
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const room = await createRoomAPI(token, roomName.trim());
      setRooms([...rooms, room]);
      setRoomName('');
      setMode('home');
      loadLeaderboard(room);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const room = await joinRoomAPI(token, joinCode.trim());
      setRooms([...rooms, room]);
      setJoinCode('');
      setMode('home');
      loadLeaderboard(room);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const loadLeaderboard = async (room) => {
    setSelectedRoom(room);
    setLoadingLeaderboard(true);
    setMode('leaderboard');

    const entries = [];

    for (const member of room.members) {
      try {
        const [lcData, cfData] = await Promise.all([
          member.lcUsername
            ? fetchLeetCodeData(member.lcUsername)
            : Promise.resolve(null),
          member.cfUsername
            ? fetchCodeforcesData(member.cfUsername)
            : Promise.resolve(null)
        ]);

        entries.push({
          email: member.email,
          lcUsername: member.lcUsername || '—',
          cfUsername: member.cfUsername || '—',
          weeklyScore: calculateWeeklyScore(lcData, cfData),
          totalScore: calculateTotalScore(lcData, cfData),
          isYou: member.email === currentUser?.email
        });
      } catch (err) {
        entries.push({
          email: member.email,
          lcUsername: member.lcUsername || '—',
          cfUsername: member.cfUsername || '—',
          weeklyScore: 0,
          totalScore: 0,
          isYou: member.email === currentUser?.email
        });
      }
    }

    entries.sort((a, b) => b.weeklyScore - a.weeklyScore);
    setLeaderboard(entries);
    setLoadingLeaderboard(false);
  };

  if (!token) {
    const mockPlayers = [
      { rank: 1, name: 'Priya Sharma', weeklyScore: 186, totalScore: 1240 },
      { rank: 2, name: 'Rahul Verma', weeklyScore: 159, totalScore: 980 },
      { rank: 3, name: 'Aditya Kumar', weeklyScore: 135, totalScore: 860 },
      { rank: 4, name: 'Sneha Patel', weeklyScore: 110, totalScore: 720 },
      { rank: 5, name: 'You', weeklyScore: 94, totalScore: 640, isYou: true },
    ];

    return (
      <div className="leaderboard-card">
        <div className="lb-header">
          <h2 className="card-title">Campus Leaderboard</h2>
          <span className="week-label">Login to create rooms</span>
        </div>
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weekly pts</th>
              <th>Total pts</th>
            </tr>
          </thead>
          <tbody>
            {mockPlayers.map((p) => (
              <tr key={p.rank} className={p.isYou ? 'you-row' : ''}>
                <td className="rank-cell">
                  {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : p.rank}
                </td>
                <td>{p.name}</td>
                <td className="points-cell">{p.weeklyScore}</td>
                <td>{p.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="leaderboard-card">
      <div className="lb-header">
        <h2 className="card-title">Campus Rooms</h2>
        {mode !== 'home' && (
          <button className="btn-back" onClick={() => setMode('home')}>
            ← Back
          </button>
        )}
      </div>

      {mode === 'home' && (
        <>
          <div className="room-actions">
            <button
              className="btn-room-action"
              onClick={() => { setMode('create'); setError(''); }}
            >
              ➕ Create Room
            </button>
            <button
              className="btn-room-action secondary"
              onClick={() => { setMode('join'); setError(''); }}
            >
              🔗 Join Room
            </button>
          </div>

          {rooms.length === 0 && (
            <p className="lb-empty">
              No rooms yet. Create one and invite your friends!
            </p>
          )}

          <div className="room-list">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="room-item"
                onClick={() => loadLeaderboard(room)}
              >
                <div className="room-info">
                  <span className="room-name">{room.name}</span>
                  <span className="room-members">
                    {room.members.length} member{room.members.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="room-right">
                  <span className="room-code">{room.code}</span>
                  <span className="room-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'create' && (
        <div className="room-form">
          <p className="room-form-label">Room Name</p>
          <input
            className="room-input"
            type="text"
            placeholder="e.g. ISM Dhanbad Batch 2027"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
          />
          {error && <p className="room-error">❌ {error}</p>}
          <button
            className="btn-room-action"
            onClick={handleCreateRoom}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="room-form">
          <p className="room-form-label">Enter Room Code</p>
          <input
            className="room-input"
            type="text"
            placeholder="e.g. ABC123"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
          {error && <p className="room-error">❌ {error}</p>}
          <button
            className="btn-room-action"
            onClick={handleJoinRoom}
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      )}

      {mode === 'leaderboard' && selectedRoom && (
        <>
          <div className="lb-room-header">
            <span className="lb-room-name">{selectedRoom.name}</span>
            <span className="room-code-badge">Code: {selectedRoom.code}</span>
          </div>

          {loadingLeaderboard ? (
            <p className="lb-loading">⏳ Fetching member stats...</p>
          ) : (
            <table className="lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Member</th>
                  <th>LC</th>
                  <th>CF</th>
                  <th>Weekly</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.email}
                    className={entry.isYou ? 'you-row' : ''}
                  >
                    <td className="rank-cell">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </td>
                    <td className="member-cell">
                      <span>{entry.email}</span>
                    </td>
                    <td>{entry.lcUsername}</td>
                    <td>{entry.cfUsername}</td>
                    <td className="points-cell">{entry.weeklyScore} pts</td>
                    <td>{entry.totalScore} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Leaderboard;