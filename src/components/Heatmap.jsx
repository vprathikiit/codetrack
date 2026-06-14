import React, { useState } from "react";
import '../styles/Heatmap.css';
import { getLast365Days, mergeCalendars, getDayBreakdown } from "../utils/dateUtils";

function Heatmap({lcCalendar, cfCalendar}) {
    const [tooltip, setTooltip] = useState(null);

    const days = getLast365Days();
    const mergedCalendar = mergeCalendars(lcCalendar, cfCalendar);

    const getColor = (count) => {
        if(!count || count === 0) {
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

    const getTotalSubmissions = () => {
        return Object.values(mergedCalendar).reduce((a, b) => a + b, 0);
    };

    const getActiveDays = () => {
        return Object.values(mergedCalendar).filter(v => v > 0).length;
    };

    const getMonthLabels = () => {
        const labels = [];
        let lastMonth = -1;

    days.forEach((day, index) => {
        const date = new Date(day.timestamp * 1000);
        const month = date.getMonth();
        if(month !== lastMonth) {
            labels.push({
                index,
                label: date.toLocaleDateString('en-US', {month: 'short'})
            });
            lastMonth = month;
        }
      });
      return labels;
    };

    const monthLabels = getMonthLabels();

    const handleMouseEnter = (day, e) => {
        const count = mergedCalendar[day.timestamp] || 0;
        const {lcCount, cfCount} = getDayBreakdown(
            day.timestamp,
            lcCalendar,
            cfCalendar
        );

        setTooltip({
            dateStr: day.dateStr,
            total: count,
            lcCount,
            cfCount,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div className="heatmap-card">
            <div className="heatmap-header">
                <h2 className="card-title">Activity - Last 365 Days</h2>
                <div className="heatmap-stats">
                    <span className="heatmap-stat">
                        <strong>{getTotalSubmissions()}</strong> total submissions
                    </span>
                    <span className="heatmap-stat">
                        <strong>{getActiveDays()}</strong> active days
                    </span>
                </div>
            </div>
            
            <div className="month-labels">
                {monthLabels.map((m) => (
                    <span
                      key={m.index}
                      className="month-label"
                      style={{gridColumnStart: Math.floor(m.index / 7) + 1}}
                    >
                        {m.label}
                    </span>
                ))}
            </div>

            <div className="heatmap-grid">
                {days.map((day, index) => {
                    const count = mergedCalendar[day.timestamp] || 0;
                    return (
                        <div 
                          key={index}
                          className="heatmap-cell"
                          style={{backgroundColor: getColor(count)}}
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={handleMouseLeave}
                        />
                    );
                })}
            </div>

            <div className="heatmap-legend">
                <span>Less</span>
                {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map(
                    (color, i) => (
                        <div 
                          key={i}
                          className="legend-cell"
                          style={{backgroundColor: color}}
                        />
                    )
                )}
                <span>More</span>
            </div>

            {tooltip && (
                <div 
                  className="heatmap-tooltip"
                  style={{top : tooltip.y - 90, left: tooltip.x - 80}}
                >
                    <div className="tooltip-date">{tooltip.dateStr}</div>
                    {tooltip.total === 0 ? (
                        <div className="tooltip-none">No submissions</div>
                    ) : (
                      <>
                        <div className="tooltip-row lc">
                            🟡 LeetCode: {tooltip.lcCount}
                        </div>
                        <div className="tooltip-row cf">
                            🔵 Codeforces: {tooltip.cfCount}
                        </div>
                        <div className="tooltip-total">
                            Total : {tooltip.total}
                        </div>
                      </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Heatmap;