import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getANODashboardAPI } from '../../api/dashboard';
import { submitLectureAPI } from '../../api/lectures';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { errMsg, fmtDate, deadlineStatus } from '../../utils/format';

export default function SubmitLecture() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [form, setForm] = useState({
    assignmentId: '', title: '', description: '',
    duration: '', cadetsAttended: '', conductedOn: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getANODashboardAPI()
      .then(r => {
        const active = (r.data.assignments || []).filter(a => a.pending > 0);
        setAssignments(active);
        if (active.length === 1) setForm(p => ({ ...p, assignmentId: active[0]._id }));
      })
      .catch(() => {})
      .finally(() => setLoadingAssignments(false));
  }, []);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.assignmentId) e.assignmentId = 'Please select an assignment';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.duration || Number(form.duration) < 1) e.duration = 'Duration must be at least 1 minute';
    if (form.cadetsAttended === '' || Number(form.cadetsAttended) < 0) e.cadetsAttended = 'Enter a valid number';
    if (!form.conductedOn) e.conductedOn = 'Conducted date is required';
    else if (new Date(form.conductedOn) > new Date()) e.conductedOn = 'Cannot be a future date';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError('');
    try {
      await submitLectureAPI({
        ...form,
        duration: Number(form.duration),
        cadetsAttended: Number(form.cadetsAttended),
      });
      setSuccess('Lecture submitted successfully!');
      setForm({ assignmentId: '', title: '', description: '', duration: '', cadetsAttended: '', conductedOn: '' });
      setTimeout(() => navigate('/ano/my-lectures'), 1600);
    } catch (err) {
      setApiError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAssignment = assignments.find(a => a._id === form.assignmentId);

  return (
    <div style={{ maxWidth: 680 }}>
      <Card title="Submit Lecture Report" subtitle="Record a completed lecture for your assignment">

        {success && (
          <div style={{ marginBottom: 20 }}>
            <Alert variant="success">{success}</Alert>
          </div>
        )}
        {apiError && (
          <div style={{ marginBottom: 20 }}>
            <Alert variant="error" onClose={() => setApiError('')}>{apiError}</Alert>
          </div>
        )}

        {loadingAssignments ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spinner label="Loading your assignments..." />
          </div>
        ) : assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h3 style={{ color: '#111827', marginBottom: 8 }}>All Caught Up!</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              You have no pending lectures to submit, or no assignments have been created for you yet.
            </p>
            <Button variant="secondary" style={{ marginTop: 16 }} onClick={() => navigate('/ano/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Assignment selector */}
            <Select
              label="Assignment" name="assignmentId" required
              value={form.assignmentId} onChange={handleChange} error={errors.assignmentId}
            >
              <option value="">— Select Assignment —</option>
              {assignments.map(a => {
                const ds = deadlineStatus(a.deadline);
                return (
                  <option key={a._id} value={a._id}>
                    {a.assignedLectures} lectures · {a.pending} pending · deadline {fmtDate(a.deadline)}
                  </option>
                );
              })}
            </Select>

            {/* Selected assignment info card */}
            {selectedAssignment && (
              <div style={{
                background: '#f0f9ff', border: '1px solid #bae6fd',
                borderRadius: 10, padding: '14px 16px',
                display: 'flex', gap: 16, flexWrap: 'wrap',
              }}>
                {[
                  { label: 'Assigned', value: selectedAssignment.assignedLectures, color: '#1a56db' },
                  { label: 'Completed', value: selectedAssignment.completed, color: '#10b981' },
                  { label: 'Pending', value: selectedAssignment.pending, color: '#f59e0b' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Lecture details */}
            <Input
              label="Lecture Title" name="title" required
              placeholder="e.g. Drill Commands and Formations"
              value={form.title} onChange={handleChange} error={errors.title}
            />

            <Textarea
              label="Description" name="description" required rows={4}
              placeholder="Describe the topics covered, methodology used, and key takeaways..."
              value={form.description} onChange={handleChange} error={errors.description}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="form-grid-3">
              <Input
                label="Duration (minutes)" name="duration" type="number"
                min="1" placeholder="e.g. 60" required
                value={form.duration} onChange={handleChange} error={errors.duration}
              />
              <Input
                label="Cadets Attended" name="cadetsAttended" type="number"
                min="0" placeholder="e.g. 45" required
                value={form.cadetsAttended} onChange={handleChange} error={errors.cadetsAttended}
              />
              <Input
                label="Conducted On" name="conductedOn" type="date" required
                value={form.conductedOn} onChange={handleChange} error={errors.conductedOn}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 4, borderTop: '1px solid #f3f4f6' }}>
              <Button type="submit" loading={submitting} icon="✓">Submit Lecture</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/ano/dashboard')}>Cancel</Button>
            </div>
          </form>
        )}
      </Card>

      <style>{`
        @media (max-width: 600px) { .form-grid-3 { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
