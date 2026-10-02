import React from 'react';
import { Link } from 'react-router-dom';
import { getAllANOsAPI } from '../../api/assignments';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { fmtDate } from '../../utils/format';

export default function ANOList() {
  const { data, loading, error } = useFetch(getAllANOsAPI);
  const anos = data?.anos || [];

  return (
    <Card title="ANO Officers" subtitle={`${anos.length} registered officers`}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spinner label="Loading officers..." />
        </div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : anos.length === 0 ? (
        <EmptyState icon="👥" title="No ANO officers found" message="No ANOs have registered yet." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {anos.map(ano => (
            <div key={ano._id} style={{
              border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px',
              background: '#fff', transition: 'box-shadow .2s, border-color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)'; e.currentTarget.style.borderColor = '#c7d7fd'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
            >
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                }}>
                  {ano.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ano.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ANO Officer</div>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>🏛️</span>
                  <span style={{ fontSize: '0.8125rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ano.college}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>✉️</span>
                  <span style={{ fontSize: '0.8125rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ano.email}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>📅</span>
                  <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Joined {fmtDate(ano.createdAt)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/ao/anos/${ano._id}`} style={{ flex: 1 }}>
                  <Button variant="primary" size="sm" fullWidth>View Progress</Button>
                </Link>
                <Link to={`/ao/assignments/create`}>
                  <Button variant="secondary" size="sm" icon="＋">Assign</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
