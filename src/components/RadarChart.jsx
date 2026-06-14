import React from "react";
import '../styles/RadarChart.css';

function RadarChart() {
    const topics = [
        {name : 'Arrays', accuracy : 85},
        {name : 'DP', accuracy : 40},
        {name : 'Trees', accuracy : 70},
        {name : 'Graphs', accuracy : 55},
        {name : 'Two Pointers', accuracy : 90},
        {name : 'Strings', accuracy : 60},
    ];

    const weakTopics = topics.filter(t => t.accuracy < 65);

    return (
        <div className="radar-card">
            <h2 className="card-title">Weakness Breakdown</h2>
            <div className="topic-bars">
                {topics.map((topic) => (
                    <div key={topic.name} className="topic-row">
                        <span className="topic-name">{topic.name}</span>
                        <div className="bar-track">
                            <div 
                            className="bar-fill"
                            style={{
                              width: `${topic.accuracy}%`,
                              backgroundColor: topic.accuracy < 65 ? '#f85149' : '#3fb950'
                            }}
                            />
                        </div>
                        <span className="topic-percent">{topic.accuracy}%</span>
                    </div>
                ))}
            </div>
            <div className="weak-alert">
                ⚠️ Focus on: {weakTopics.map(t => t.name).join(', ')}
            </div>
        </div>
    );
}

export default RadarChart;