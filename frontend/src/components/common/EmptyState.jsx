import React from 'react';

export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>{title}</h3>
      {message && <p style={{ fontSize: '0.875rem', color: '#9ca3af', maxWidth: 320, lineHeight: 1.6 }}>{message}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}
