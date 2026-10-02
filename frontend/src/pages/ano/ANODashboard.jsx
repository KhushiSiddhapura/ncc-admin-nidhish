import React from 'react';
import { Link } from 'react-router-dom';
import { getANODashboardAPI } from '../../api/dashboard';
import useFetch from '../../hooks/useFetch';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { fmtDate, fmtDateTime, deadlineStatus } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

export default function ANODashboard() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch(getANODashboardAPI);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size="lg" label="Loading dashboard..." />
    </div>
  );
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!data) return null;

  const { totalAssigned, totalCompleted, totalPending, assignments, recentSubmissions } = data;
  const overallPct = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)',
        borderRadius: 14, padding: '24px 32px', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Welcome, {user?.name?.split(' ')[0]}! 👋</h2>
          <p style={{ opacity: 0.85, margin: '6px 0 0', fontSize: '0.875rem' }}>
            {totalPending > 0
              ? `You have ${totalPending} pending lecture${totalPending > 1 ? 's' : ''} to complete.`
              : totalAssigned > 0
                ? '🎉 All lectures completed! Great work.'
                : 'No assignments yet. Check back soon.'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{overallPct}%</div>
          <div style={{ opacity: 0.8, fontSize: '0.8125rem' }}>Overall Progress</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="Total Assigned" value={totalAssigned} icon="🎯" color="blue" />
        <StatCard label="Completed" value={totalCompleted} icon="✅" color="green" />
        <StatCard label="Pending" value={totalPending} icon="⏳" color="amber" />
      </div>

      {/* Overall progress */}
      {totalAssigned > 0 && (
        <Card title="Overall Progress">
          <ProgressBar value={totalCompleted} max={totalAssigned} height={14} />
        </Card>
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="ano-grid">

        {/* Active Assignments */}
        <Card
          title="My Assignments"
          subtitle={`${assignments.length} active`}
          action={<Link to="/ano/assignments"><Button variant="ghost" size="sm">View All →</Button></Link>}
        >
          {assignments.length === 0 ? (
            <EmptyState icon="📋" title="No assignments" message="You haven't been assigned any lectures yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {assignments.slice(0, 4).map(a => {
                const ds = deadlineStatus(a.deadline);
                return (
                  <div key={a._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                          {a.completed}/{a.assignedLectures} lectures
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{a.remarks || 'No remarks'}</div>
                      </div>
                      <Badge variant={ds.variant}>{ds.label}</Badge>
                    </div>
                    <ProgressBar value={a.completed} max={a.assignedLectures || 1} showLabel={false} height={6} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Submissions */}
        <Card
          title="Recent Submissions"
          subtitle="Your latest reports"
          action={<Link to="/ano/my-lectures"><Button variant="ghost" size="sm">View All →</Button></Link>}
        >
          {recentSubmissions.length === 0 ? (
            <EmptyState icon="📝" title="No submissions yet"
              message="Submit your first lecture report."
              action={<Link to="/ano/submit-lecture"><Button size="sm">Submit Lecture</Button></Link>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentSubmissions.map((s, i) => (
                <div key={s._id} style={{
                  display: 'flex', gap: 12, padding: '11px 0',
                  borderBottom: i < recentSubmissions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: '#d1fae5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
                  }}>✓</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.duration} min · {s.cadetsAttended} cadets</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 1 }}>{fmtDateTime(s.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/ano/submit-lecture">
            <Button icon="✏️">Submit Lecture</Button>
          </Link>
          <Link to="/ano/assignments">
            <Button variant="secondary" icon="📋">My Assignments</Button>
          </Link>
          <Link to="/ano/my-lectures">
            <Button variant="secondary" icon="📚">My Submissions</Button>
          </Link>
          <Button variant="secondary" icon="🔄" onClick={refetch}>Refresh</Button>
        </div>
      </Card>

      <style>{`
        @media (max-width: 768px) { .ano-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
