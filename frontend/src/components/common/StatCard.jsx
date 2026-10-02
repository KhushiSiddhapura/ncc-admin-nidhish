import React from 'react';

const colorMap = {
  blue:    { bg: '#e8f0fe', icon: '#1a56db', border: '#c7d7fd' },
  green:   { bg: '#d1fae5', icon: '#10b981', border: '#a7f3d0' },
  amber:   { bg: '#fef3c7', icon: '#f59e0b', border: '#fde68a' },
  red:     { bg: '#fee2e2', icon: '#ef4444', border: '#fecaca' },
  sky:     { bg: '#e0f2fe', icon: '#0ea5e9', border: '#bae6fd' },
  purple:  { bg: '#ede9fe', icon: '#7c3aed', border: '#ddd6fe' },
};

export default function StatCard({ label, value, icon, color = 'blue', sub }) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${c.border}`,
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      transition: 'box-shadow .2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.06)'}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 10,
        background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 22, color: c.icon }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
        <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, marginTop: 2 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}
