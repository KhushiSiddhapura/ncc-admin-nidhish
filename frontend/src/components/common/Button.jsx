import React from 'react';
import Spinner from './Spinner';

const variants = {
  primary:   { bg: '#1a56db', color: '#fff', border: '#1a56db', hover: '#1140a6' },
  secondary: { bg: '#fff', color: '#374151', border: '#d1d5db', hover: '#f9fafb' },
  danger:    { bg: '#ef4444', color: '#fff', border: '#ef4444', hover: '#dc2626' },
  ghost:     { bg: 'transparent', color: '#4b5563', border: 'transparent', hover: '#f3f4f6' },
  success:   { bg: '#10b981', color: '#fff', border: '#10b981', hover: '#059669' },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '0.8125rem' },
  md: { padding: '9px 18px', fontSize: '0.875rem' },
  lg: { padding: '12px 24px', fontSize: '1rem' },
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, disabled = false, icon, fullWidth = false, onClick, type = 'button', style = {} }) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: s.padding, fontSize: s.fontSize, fontWeight: 600,
        background: v.bg, color: v.color,
        border: `1px solid ${v.border}`, borderRadius: 8,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.65 : 1,
        transition: 'all .15s',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.background = v.hover; }}
      onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.background = v.bg; }}
    >
      {loading ? <Spinner size="sm" /> : icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
