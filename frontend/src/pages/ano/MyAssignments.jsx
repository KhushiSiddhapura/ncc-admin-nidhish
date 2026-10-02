import React from 'react';
import { Link } from 'react-router-dom';
import { getANODashboardAPI } from '../../api/dashboard';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { fmtDate, deadlineStatus } from '../../utils/format';

export default function MyAssignments() {
  const { data, loading, error } = useFetch(getANODashboardAPI);
  const assignments = data?.assignments || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card
        title="My Assignments"
        subtitle={`${assignments.length} assignment${assignments.length !== 1 ? 's' : ''}`}
        action={
          <Link to="/ano/submit-lecture">
            <Button icon="✏️" size="sm">Submit Lecture</Button>
          </Link>
        }
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spinner label="Loading assignments..." />
          </div>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : assignments.length === 0 ? (
          <EmptyState icon="📋" title="No assignments yet" message="You haven't been assigned any lectures yet." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {assignments.map(a => {
              const ds = deadlineStatus(a.deadline);
              const pct = a.assignedLectures > 0 ? Math.round((a.completed / a.assignedLectures) * 100) : 0;
              return (
                <div key={a._id} style={{
                  border: '1px solid #e5e7eb', borderRadius: 12, padding: 20,
                  background: '#fff', display: 'flex', flexDirection: 'column', gap: 14,
                  transition: 'box-shadow .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, background: '#e8f0fe',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>📋</div>
                    <Badge variant={ds.variant}>{ds.label}</Badge>
                  </div>

                  {/* Counts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Assigned', value: a.assignedLectures, color: '#1a56db' },
                      { label: 'Done', value: a.completed, color: '#10b981' },
                      { label: 'Left', value: a.pending, color: '#f59e0b' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 8, padding: '8px 4px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{value}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <ProgressBar value={a.completed} max={a.assignedLectures || 1} showLabel={false} height={8} />
                  </div>

                  {/* Remarks */}
                  {a.remarks && (
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
                      📝 {a.remarks}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Created {fmtDate(a.createdAt)}</span>
                    {a.pending > 0 && (
                      <Link to="/ano/submit-lecture">
                        <Button size="sm" icon="✏️">Submit</Button>
                      </Link>
                    )}
                    {a.pending === 0 && (
                      <Badge variant="success">Complete ✓</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
