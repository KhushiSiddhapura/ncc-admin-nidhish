import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const aoNav = [
  { to: '/ao/dashboard',          icon: '⊞',  label: 'Dashboard' },
  { to: '/ao/assignments',        icon: '📋', label: 'Assignments' },
  { to: '/ao/assignments/create', icon: '＋', label: 'Assign Lectures' },
  { to: '/ao/anos',               icon: '👥', label: 'ANO Officers' },
  { to: '/ao/lectures',           icon: '📚', label: 'Submissions' },
];

const anoNav = [
  { to: '/ano/dashboard',      icon: '⊞',  label: 'Dashboard' },
  { to: '/ano/assignments',    icon: '📋', label: 'My Assignments' },
  { to: '/ano/submit-lecture', icon: '✏️', label: 'Submit Lecture' },
  { to: '/ano/my-lectures',    icon: '📚', label: 'My Submissions' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = user?.role === 'AO' ? aoNav : anoNav;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 260, background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        transform: open ? 'translateX(0)' : undefined,
        boxShadow: '2px 0 8px rgba(0,0,0,.04)',
      }} className="sidebar">

        {/* Logo */}
        <div style={{
          height: 64, padding: '0 24px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid #f3f4f6',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
          }}>N</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', lineHeight: 1.2 }}>NCC Admin</div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 500 }}>Administration Portal</div>
          </div>
          {/* Mobile close */}
          <button onClick={onClose} className="sidebar-close"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 20, color: '#6b7280', padding: 4, display: 'none' }}>
            ✕
          </button>
        </div>

        {/* Role badge */}
        <div style={{ padding: '14px 20px 10px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 20,
            background: user?.role === 'AO' ? '#e8f0fe' : '#d1fae5',
            color: user?.role === 'AO' ? '#1e40af' : '#065f46',
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            {user?.role === 'AO' ? 'Admin Officer' : 'ANO Officer'}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
          {nav.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                color: isActive ? '#1a56db' : '#4b5563',
                background: isActive ? '#e8f0fe' : 'transparent',
                textDecoration: 'none', transition: 'all .15s',
              })}
              onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0,
            }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.college}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: '1px solid #e5e7eb',
            borderRadius: 8, fontSize: '0.8125rem', fontWeight: 500,
            color: '#4b5563', cursor: 'pointer', transition: 'all .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            <span>⇤</span> Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%) !important;
            transition: transform .25s ease;
          }
          .sidebar-close { display: flex !important; }
        }
        .sidebar[style*="translateX(0)"] {
          transform: translateX(0) !important;
        }
      `}</style>
    </>
  );
}