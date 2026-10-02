import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const titles = {
  '/ao/dashboard':          { title: 'Dashboard', sub: 'Overview of NCC administration' },
  '/ao/assignments':        { title: 'Assignments', sub: 'Manage lecture assignments' },
  '/ao/assignments/create': { title: 'Assign Lectures', sub: 'Create a new lecture assignment' },
  '/ao/anos':               { title: 'ANO Officers', sub: 'All Associate NCC Officers' },
  '/ao/lectures':           { title: 'Lecture Submissions', sub: 'All submitted lecture reports' },
  '/ano/dashboard':         { title: 'Dashboard', sub: 'Your lecture progress' },
  '/ano/assignments':       { title: 'My Assignments', sub: 'Lectures assigned to you' },
  '/ano/submit-lecture':    { title: 'Submit Lecture', sub: 'Submit a lecture completion report' },
  '/ano/my-lectures':       { title: 'My Submissions', sub: 'Lectures you have submitted' },
};

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Match dynamic routes like /ao/anos/:id
  const matchKey = Object.keys(titles).find(k => pathname === k || pathname.startsWith(k + '/'));
  const meta = titles[matchKey] || { title: 'NCC Administration', sub: '' };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header style={{
      height: 64, background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 16,
      position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 3px rgba(0,0,0,.05)',
    }}>
      {/* Hamburger (mobile) */}
      <button onClick={onMenuClick} className="hamburger"
        style={{
          display: 'none', background: 'none', border: 'none',
          padding: 6, borderRadius: 6, cursor: 'pointer', color: '#4b5563', fontSize: 20,
        }}>
        ☰
      </button>

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{meta.title}</h1>
        {meta.sub && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 1 }}>{meta.sub}</p>}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div className="date-display" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{dateStr}</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', background: '#f9fafb',
          border: '1px solid #e5e7eb', borderRadius: 8,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0,
          }}>
            {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="user-name-display">
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{user?.name}</div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .date-display { display: none !important; }
        }
        @media (max-width: 480px) {
          .user-name-display { display: none !important; }
          header { padding: 0 16px !important; }
        }
      `}</style>
    </header>
  );
}
