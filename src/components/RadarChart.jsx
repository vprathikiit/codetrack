import React, {useState} from "react";
import {
    RadarChart as RechartsRadar,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import '../styles/RadarChart.css';
import { processTagStats, getWeakTopics } from "../utils/tagUtils";

function RadarChart({tagStats}) {

    const [view, setView] = useState('bars');

    const processedTags = processTagStats(tagStats);
    const weakTopics = getWeakTopics(processedTags);

    const radarData = processedTags.map((t) => ({
        topic: t.name,
        accuracy: t.accuracy,
        fullMark: 100
    }));

    if(!tagStats || processedTags.length === 0) {
        return (
            <div className="radar-card empty-stats">
                <p>Enter a Codeforces username to see your weakness Breakdown</p>
            </div>
        );
    }

    return (
        <div className="radar-card">
            <div className="radar-header">
                <h2 className="card-title">Weakness Breakdown</h2>
                <div className="view-toggle">
                    <button
                      className={`toggle-btn ${view === 'bars' ? 'active' : ''}`}
                      onClick={() => setView('bars')}
                    >
                        Bars
                    </button>
                    <button
                      className={`toggle-btn ${view === 'radar' ? 'active' : ''}`}
                      onClick={() => setView('radar')}
                    >
                        Radar
                    </button>
                </div>
            </div>

            {view === 'bars' && (
                <div className="topic-bars">
                    {processedTags.map((topic) => (
                        <div key={topic.tag} className="topic-row">
                            <span className="topic-name">{topic.name}</span>
                            <div className="bar-track">
                                <div
                                  className="bar-fill"
                                  style={{
                                    width: `${topic.accuracy}%`,
                                    backgroundColor: topic.isWeak ? '#f85149' : '#3fb950'
                                  }}
                                />
                            </div>
                            <span className="topic-percent">{topic.accuracy}%</span>
                            <span className="topic-count">
                                {topic.accepted}/{topic.total}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {view === 'radar' && (
                <div className="radar-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsRadar data={radarData}>
                            <PolarGrid stroke="#30363d" />
                            <PolarAngleAxis
                              dataKey="topic"
                              tick={{fill: '#8b949e', fontSize: 11}}
                            />

                            <Radar
                              name="Accuracy"
                              dataKey="accuracy"
                              stroke="#58a6ff"
                              fill="#58a6ff"
                              fillOpacity={0.2}
                            />
                            <Tooltip
                              contentStyle={{
                                background: '#1c2128',
                                border: '1px solid #30363d',
                                borderRadius: '8px',
                                color: '#e6edf3'
                              }}
                              formatter={(value) => [[`${value}%`, 'Accuracy']]}
                            />
                        </RechartsRadar>
                    </ResponsiveContainer>
                </div>
            )}

            {weakTopics.length > 0 && (
                <div className="weak-alert">
                    <span className="weak-alert-title">⚠️ Focus on:</span>
                    <div className="weak-tags">
                        {weakTopics.map((t) => (
                            <span key={t.tag} className="weak-tag">
                                {t.name} ({t.accuracy}%)
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {weakTopics.length === 0 && (
                <div className="strong-alert">
                    ✅ Great job! All tracked topics above 60% accuracy.
                </div>
            )}
        </div>
    );
}

export default RadarChart;