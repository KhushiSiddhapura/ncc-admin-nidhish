import React from 'react';

export default function ProgressBar({ value = 0, max = 100, showLabel = true, height = 8, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const bg = color || (pct >= 100 ? '#10b981' : pct >= 60 ? '#1a56db' : pct >= 30 ? '#f59e0b' : '#ef4444');

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{value} / {max} completed</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: bg }}>{pct}%</span>
        </div>
      )}
      <div style={{ height, background: '#e5e7eb', borderRadius: height / 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: bg, borderRadius: height / 2,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}
