import React from "react";
import '../styles/Heatmap.css';

function Heatmap() {
    const generateMockData = () => {
        const data = [];
        for(let i = 0; i < 365; i++) {
            data.push(Math.floor(Math.random() * 8));
        }
        return data;
    };

    const data = generateMockData();

    const getColor = (count) => {
        if(count === 0) {
            return '#161b22';
        }
        if(count <= 2) {
            return '#0e4429';
        }
        if(count <= 4) {
            return '#006d32';
        }
        if(count <= 6) {
            return '#26a641';
        }
        return '#39d353';
    };

    return (
        <div className="heatmap-card">
            <h2 className="card-title">Activity - Last 365 days</h2>
            <div className="heatmap-grid">
                {data.map((count, index) => (
                    <div
                      key={index}
                      className="heatmap-cell"
                      style={{backgroundColor: getColor(count)}}
                      title={`${count} submissions`}
                    />
                ))}
            </div>
            <div className="heatmap-legend">
                <span>Less</span>
                {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((color, i) => (
                <div key={i} className="legend-cell" style={{ backgroundColor: color }} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

export default Heatmap;