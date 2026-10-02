import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyLecturesAPI, deleteLectureAPI } from '../../api/lectures';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { fmtDate, fmtDateTime, errMsg } from '../../utils/format';

export default function MyLectures() {
  const { data, loading, error, refetch } = useFetch(getMyLecturesAPI);
  const [detail, setDetail] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLectureAPI(confirmId);
      setConfirmId(null);
      refetch();
    } catch (err) {
      setDeleteError(errMsg(err));
    } finally {
      setDeleting(false);
    }
  };

  const lectures = data?.lectures || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {deleteError && <Alert variant="error" onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      <Card
        title="My Lecture Submissions"
        subtitle={`${lectures.length} total`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" icon="🔄" onClick={refetch}>Refresh</Button>
            <Link to="/ano/submit-lecture">
              <Button size="sm" icon="✏️">Submit New</Button>
            </Link>
          </div>
        }
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spinner label="Loading submissions..." />
          </div>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : lectures.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No submissions yet"
            message="You haven't submitted any lecture reports yet."
            action={<Link to="/ano/submit-lecture"><Button icon="✏️">Submit First Lecture</Button></Link>}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {lectures.map(lec => (
              <div key={lec._id} style={{
                border: '1px solid #e5e7eb', borderRadius: 12,
                background: '#fff', overflow: 'hidden',
                transition: 'box-shadow .2s, border-color .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,.09)'; e.currentTarget.style.borderColor = '#c7d7fd'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
              >
                {/* Card header strip */}
                <div style={{
                  height: 4,
                  background: 'linear-gradient(90deg, #1a56db, #0ea5e9)',
                }} />

                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Title + badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <h4 style={{
                      fontSize: '0.9375rem', fontWeight: 700, color: '#111827',
                      margin: 0, flex: 1,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{lec.title}</h4>
                    <Badge variant="success">Submitted</Badge>
                  </div>

                  {/* Description preview */}
                  <p style={{
                    fontSize: '0.8125rem', color: '#6b7280', margin: 0,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5,
                  }}>{lec.description}</p>

                  {/* Meta pills */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: '0.75rem', color: '#374151',
                      background: '#f3f4f6', borderRadius: 6, padding: '3px 8px',
                    }}>⏱ {lec.duration} min</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: '0.75rem', color: '#374151',
                      background: '#f3f4f6', borderRadius: 6, padding: '3px 8px',
                    }}>👥 {lec.cadetsAttended} cadets</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: '0.75rem', color: '#374151',
                      background: '#f3f4f6', borderRadius: 6, padding: '3px 8px',
                    }}>📅 {fmtDate(lec.conductedOn)}</span>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 10, borderTop: '1px solid #f3f4f6',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                      {fmtDateTime(lec.createdAt)}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="sm" variant="secondary" onClick={() => setDetail(lec)}>View</Button>
                      <Button size="sm" variant="danger" onClick={() => setConfirmId(lec._id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Lecture Details" width={560}>
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Title', value: detail.title },
                { label: 'Conducted On', value: fmtDate(detail.conductedOn) },
                { label: 'Duration', value: `${detail.duration} minutes` },
                { label: 'Cadets Attended', value: detail.cadetsAttended },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginTop: 3 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Description</div>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{detail.description}</p>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'right' }}>
              Submitted on {fmtDateTime(detail.createdAt)}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete Submission" width={420}>
        <p style={{ color: '#374151', marginBottom: 24 }}>
          Are you sure you want to delete this lecture submission? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
