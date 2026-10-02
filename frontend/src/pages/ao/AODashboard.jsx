import React from 'react';
import { Link } from 'react-router-dom';
import { getAODashboardAPI } from '../../api/dashboard';
import useFetch from '../../hooks/useFetch';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { fmtDate, fmtDateTime } from '../../utils/format';

export default function AODashboard() {
  const { data, loading, error, refetch } = useFetch(getAODashboardAPI);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size="lg" label="Loading dashboard..." />
    </div>
  );
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!data) return null;

  const { totalANOs, totalAssignments, totalAssigned, totalCompleted, totalPending, anoProgress, recentSubmissions } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Total ANOs" value={totalANOs} icon="👥" color="blue" />
        <StatCard label="Assignments" value={totalAssignments} icon="📋" color="purple" />
        <StatCard label="Total Assigned" value={totalAssigned} icon="🎯" color="sky" />
        <StatCard label="Completed" value={totalCompleted} icon="✅" color="green" />
        <StatCard label="Pending" value={totalPending} icon="⏳" color="amber" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="dashboard-grid">

        {/* ANO Progress */}
        <Card
          title="ANO-wise Progress"
          subtitle={`${totalANOs} officers`}
          action={<Link to="/ao/anos"><Button variant="ghost" size="sm">View All →</Button></Link>}
        >
          {anoProgress.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>No ANOs registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {anoProgress.map(({ ano, assigned, completed, pending }) => (
                <div key={ano._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{ano.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{ano.college}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{completed}/{assigned}</span>
                      {pending > 0 && <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>{pending} pending</div>}
                    </div>
                  </div>
                  <ProgressBar value={completed} max={assigned || 1} showLabel={false} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Submissions */}
        <Card
          title="Recent Submissions"
          subtitle="Latest lecture reports"
          action={<Link to="/ao/lectures"><Button variant="ghost" size="sm">View All →</Button></Link>}
        >
          {recentSubmissions.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>No submissions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentSubmissions.map((s, i) => (
                <div key={s._id} style={{
                  display: 'flex', gap: 12, padding: '12px 0',
                  borderBottom: i < recentSubmissions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: '#e8f0fe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>📖</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.submittedBy?.name} · {s.submittedBy?.college}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>{fmtDateTime(s.createdAt)}</div>
                  </div>
                  <Badge variant="success">Submitted</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/ao/assignments/create">
            <Button icon="＋">Assign Lectures</Button>
          </Link>
          <Link to="/ao/anos">
            <Button variant="secondary" icon="👥">View ANOs</Button>
          </Link>
          <Link to="/ao/lectures">
            <Button variant="secondary" icon="📚">View Submissions</Button>
          </Link>
          <Button variant="secondary" icon="🔄" onClick={refetch}>Refresh</Button>
        </div>
      </Card>

      <style>{`
        @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
