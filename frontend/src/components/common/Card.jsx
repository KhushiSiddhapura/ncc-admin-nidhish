import React from 'react';

export default function Card({ children, title, subtitle, action, style = {}, padding = '24px' }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      overflow: 'hidden',
      ...style,
    }}>
      {(title || action) && (
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            {title && <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: 2 }}>{subtitle}</p>}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
