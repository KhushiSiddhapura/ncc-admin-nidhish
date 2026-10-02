import React from 'react';

const sizes = { sm: 18, md: 32, lg: 48 };

export default function Spinner({ size = 'md', fullPage = false, label = '' }) {
  const px = sizes[size] || sizes.md;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg
        width={px} height={px} viewBox="0 0 38 38"
        style={{ animation: 'spin 0.8s linear infinite' }}
        aria-label="Loading"
      >
        <defs>
          <linearGradient id="sg" x1="8%" y1="0%" x2="65.7%" y2="23.9%">
            <stop offset="0%" stopColor="#1a56db" stopOpacity="0" />
            <stop offset="63.146%" stopColor="#1a56db" stopOpacity=".63" />
            <stop offset="100%" stopColor="#1a56db" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path d="M36 18c0-9.94-8.06-18-18-18" stroke="url(#sg)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="36" cy="18" r="1" fill="#1a56db" />
          </g>
        </g>
      </svg>
      {label && <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{label}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.85)', zIndex: 9999,
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
