import React, { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getANOProgressAPI } from '../../api/assignments';
import { getLecturesByAssignmentAPI } from '../../api/lectures';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { fmtDate, fmtDateTime, deadlineStatus } from '../../utils/format';

function AssignmentSubmissions({ assignmentId }) {
  const fn = useCallback(() => getLecturesByAssignmentAPI(assignmentId), [assignmentId]);
  const { data, loading } = useFetch(fn);
  const lectures = data?.lectures || [];

  if (loading) return <Spinner size="sm" />;
  if (lectures.length === 0) return <p style={{ fontSize: '0.8125rem', color: '#9ca3af', padding: '8px 0' }}>No submissions yet.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
      {lectures.map((l, i) => (
        <div key={l._id} style={{
          display: 'flex', gap: 12, padding: '10px 0',
          borderBottom: i < lectures.length - 1 ? '1px solid #f3f4f6' : 'none',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, background: '#d1fae5',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
          }}>✓</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#111827' }}>{l.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {l.duration} min · {l.cadetsAttended} cadets · {fmtDate(l.conductedOn)}
            </div>
          </div>
          <Badge variant="success">Done</Badge>
        </div>
      ))}
    </div>
  );
}

export default function ANOProgress() {
  const { anoId } = useParams();
  const fn = useCallback(() => getANOProgressAPI(anoId), [anoId]);
  const { data, loading, error } = useFetch(fn);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size="lg" label="Loading progress..." />
    </div>
  );
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!data) return null;

  const { ano, totalAssigned, completed, pending, assignments } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)',
        borderRadius: 14, padding: '28px 32px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.25rem', flexShrink: 0,
        }}>
          {ano.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0 }}>{ano.name}</h2>
          <p style={{ opacity: 0.85, margin: '4px 0 0', fontSize: '0.875rem' }}>{ano.college} · {ano.email}</p>
        </div>
        <Link to="/ao/anos">
          <Button variant="secondary" size="sm">← Back to ANOs</Button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="Total Assigned" value={totalAssigned} icon="🎯" color="blue" />
        <StatCard label="Completed" value={completed} icon="✅" color="green" />
        <StatCard label="Pending" value={pending} icon="⏳" color="amber" />
        <StatCard label="Assignments" value={assignments.length} icon="📋" color="purple" />
      </div>

      {/* Overall progress bar */}
      <Card title="Overall Completion">
        <ProgressBar value={completed} max={totalAssigned || 1} height={12} />
      </Card>

      {/* Per-assignment breakdown */}
      {assignments.length === 0 ? (
        <EmptyState icon="📋" title="No assignments yet" message="No lecture assignments have been created for this ANO." />
      ) : (
        assignments.map(a => {
          const ds = deadlineStatus(a.deadline);
          return (
            <Card key={a._id}
              title={`Assignment · ${fmtDate(a.createdAt)}`}
              subtitle={a.remarks || 'No remarks'}
              action={<Badge variant={ds.variant}>{ds.label}</Badge>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* mini stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Assigned', value: a.assignedLectures, color: '#1a56db' },
                    { label: 'Completed', value: a.completed, color: '#10b981' },
                    { label: 'Pending', value: a.pending, color: '#f59e0b' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      background: '#f9fafb', borderRadius: 8, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                <ProgressBar value={a.completed} max={a.assignedLectures || 1} height={8} />

                {/* Submissions */}
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    Submitted Lectures
                  </div>
                  <AssignmentSubmissions assignmentId={a._id} />
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
