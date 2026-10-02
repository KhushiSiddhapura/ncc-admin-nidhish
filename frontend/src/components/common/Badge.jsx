import React from 'react';

const variants = {
  success: { bg: '#d1fae5', color: '#065f46' },
  warning: { bg: '#fef3c7', color: '#92400e' },
  danger:  { bg: '#fee2e2', color: '#991b1b' },
  info:    { bg: '#e0f2fe', color: '#0c4a6e' },
  primary: { bg: '#e8f0fe', color: '#1e40af' },
  gray:    { bg: '#f3f4f6', color: '#374151' },
};

export default function Badge({ children, variant = 'gray' }) {
  const v = variants[variant] || variants.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 20,
      fontSize: '0.75rem', fontWeight: 600,
      background: v.bg, color: v.color,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
