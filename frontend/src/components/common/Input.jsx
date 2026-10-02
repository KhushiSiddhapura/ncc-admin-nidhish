import React from 'react';

export default function Input({ label, error, type = 'text', required, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
          {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        type={type}
        {...props}
        style={{
          width: '100%', padding: '9px 12px',
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
          borderRadius: 8, fontSize: '0.875rem',
          color: '#111827', background: '#fff',
          outline: 'none', transition: 'border-color .15s',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = error ? '#ef4444' : '#1a56db'}
        onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#d1d5db'}
      />
      {error && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{error}</span>}
    </div>
  );
}
