import React from 'react';

const variants = {
  error:   { bg: '#fee2e2', border: '#fecaca', color: '#991b1b', icon: '✕' },
  success: { bg: '#d1fae5', border: '#a7f3d0', color: '#065f46', icon: '✓' },
  warning: { bg: '#fef3c7', border: '#fde68a', color: '#92400e', icon: '⚠' },
  info:    { bg: '#e0f2fe', border: '#bae6fd', color: '#0c4a6e', icon: 'ℹ' },
};

export default function Alert({ children, variant = 'error', onClose }) {
  const v = variants[variant] || variants.error;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 16px', borderRadius: 8,
      background: v.bg, border: `1px solid ${v.border}`,
      color: v.color, fontSize: '0.875rem',
    }}>
      <span style={{ fontWeight: 700, flexShrink: 0 }}>{v.icon}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: v.color, opacity: 0.7, flexShrink: 0, fontSize: 16, lineHeight: 1,
        }}>✕</button>
      )}
    </div>
  );
}
