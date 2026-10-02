import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAssignmentsAPI, deleteAssignmentAPI } from '../../api/assignments';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { fmtDate, deadlineStatus, errMsg } from '../../utils/format';

export default function AssignmentList() {
  const { data, loading, error, refetch } = useFetch(getAllAssignmentsAPI);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = async () => {
    setDeleting(confirmId);
    setDeleteError('');
    try {
      await deleteAssignmentAPI(confirmId);
      setConfirmId(null);
      refetch();
    } catch (err) {
      setDeleteError(errMsg(err));
    } finally {
      setDeleting(null);
    }
  };

  const assignments = data?.assignments || [];

  const columns = [
    {
      key: 'anoId', label: 'ANO Officer',
      render: (v) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>{v?.name || '—'}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{v?.college}</div>
        </div>
      ),
    },
    {
      key: 'assignedLectures', label: 'Assigned',
      render: (v) => <span style={{ fontWeight: 700, color: '#1a56db', fontSize: '1rem' }}>{v}</span>,
    },
    {
      key: 'deadline', label: 'Deadline',
      render: (v) => {
        const s = deadlineStatus(v);
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: 'remarks', label: 'Remarks',
      render: (v) => <span style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{v || '—'}</span>,
    },
    {
      key: 'createdAt', label: 'Created',
      render: (v) => <span style={{ color: '#9ca3af', fontSize: '0.8125rem' }}>{fmtDate(v)}</span>,
    },
    {
      key: '_id', label: 'Actions', align: 'right',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Link to={`/ao/anos/${row.anoId?._id}`}>
            <Button variant="ghost" size="sm">Progress</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setConfirmId(id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {deleteError && <Alert variant="error" onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      <Card
        title="All Assignments"
        subtitle={`${assignments.length} total`}
        action={
          <Link to="/ao/assignments/create">
            <Button icon="＋" size="sm">New Assignment</Button>
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
          <EmptyState
            icon="📋"
            title="No assignments yet"
            message="Create your first lecture assignment for an ANO officer."
            action={<Link to="/ao/assignments/create"><Button icon="＋">Create Assignment</Button></Link>}
          />
        ) : (
          <Table columns={columns} data={assignments} />
        )}
      </Card>

      {/* Delete Confirm Modal */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete Assignment" width={420}>
        <p style={{ color: '#374151', fontSize: '0.9375rem', marginBottom: 24 }}>
          Are you sure you want to delete this assignment? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" loading={!!deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
