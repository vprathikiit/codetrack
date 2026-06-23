import React from 'react';
import '../styles/Skeleton.css';

function DashboardSkeleton() {
  return (
    <>
      {/* Profile Card Skeleton */}
      <div className="skeleton-card">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-box" />
        <div className="skeleton skeleton-box" style={{ height: '60px' }} />
        <div className="skeleton-grid">
          <div className="skeleton skeleton-box" />
          <div className="skeleton skeleton-box" />
        </div>
      </div>

      {/* Heatmap Skeleton */}
      <div className="skeleton-card">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-box" style={{ height: '140px' }} />
      </div>

      {/* Radar Skeleton */}
      <div className="skeleton-card">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row medium" />
        <div className="skeleton skeleton-row short" />
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row medium" />
      </div>
    </>
  );
}

export default DashboardSkeleton;