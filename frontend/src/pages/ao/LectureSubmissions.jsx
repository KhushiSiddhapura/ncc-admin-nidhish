import React, { useState } from 'react';
import { getAllLecturesAPI, deleteLectureAPI } from '../../api/lectures';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { fmtDate, fmtDateTime, errMsg } from '../../utils/format';

export default function LectureSubmissions() {
  const { data, loading, error, refetch } = useFetch(getAllLecturesAPI);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [detail, setDetail] = useState(null);

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

  const columns = [
    {
      key: 'title', label: 'Lecture Title',
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>{v}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{fmtDateTime(row.createdAt)}</div>
        </div>
      ),
    },
    {
      key: 'submittedBy', label: 'Submitted By',
      render: (v) => (
        <div>
          <div style={{ fontWeight: 500, color: '#374151' }}>{v?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{v?.college}</div>
        </div>
      ),
    },
    {
      key: 'conductedOn', label: 'Conducted On',
      render: (v) => <span style={{ color: '#374151', fontSize: '0.8125rem' }}>{fmtDate(v)}</span>,
    },
    {
      key: 'duration', label: 'Duration',
      render: (v) => <Badge variant="info">{v} min</Badge>,
    },
    {
      key: 'cadetsAttended', label: 'Cadets',
      render: (v) => <span style={{ fontWeight: 600, color: '#374151' }}>{v}</span>,
    },
    {
      key: '_id', label: 'Actions', align: 'right',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="sm" variant="secondary" onClick={() => setDetail(row)}>View</Button>
          <Button size="sm" variant="danger" onClick={() => setConfirmId(id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {deleteError && <Alert variant="error" onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      <Card
        title="All Lecture Submissions"
        subtitle={`${lectures.length} total submissions`}
        action={<Button variant="secondary" size="sm" icon="🔄" onClick={refetch}>Refresh</Button>}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spinner label="Loading submissions..." />
          </div>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : lectures.length === 0 ? (
          <EmptyState icon="📚" title="No submissions yet" message="ANO officers haven't submitted any lecture reports yet." />
        ) : (
          <Table columns={columns} data={lectures} />
        )}
      </Card>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Lecture Details" width={540}>
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Title', value: detail.title },
                { label: 'Submitted By', value: detail.submittedBy?.name },
                { label: 'College', value: detail.submittedBy?.college },
                { label: 'Conducted On', value: fmtDate(detail.conductedOn) },
                { label: 'Duration', value: `${detail.duration} minutes` },
                { label: 'Cadets Attended', value: detail.cadetsAttended },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginTop: 3 }}>{value || '—'}</div>
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
        <p style={{ color: '#374151', marginBottom: 24 }}>Are you sure you want to delete this lecture submission?</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
