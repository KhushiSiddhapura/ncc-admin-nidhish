import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllANOsAPI } from '../../api/assignments';
import { createAssignmentAPI } from '../../api/assignments';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { errMsg } from '../../utils/format';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [anos, setAnos] = useState([]);
  const [loadingAnos, setLoadingAnos] = useState(true);
  const [form, setForm] = useState({ anoId: '', assignedLectures: '', deadline: '', remarks: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAllANOsAPI()
      .then(r => setAnos(r.data.anos || []))
      .catch(() => {})
      .finally(() => setLoadingAnos(false));
  }, []);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.anoId) e.anoId = 'Please select an ANO';
    if (!form.assignedLectures || Number(form.assignedLectures) < 1) e.assignedLectures = 'Must be at least 1';
    if (!form.deadline) e.deadline = 'Deadline is required';
    else if (new Date(form.deadline) < new Date()) e.deadline = 'Deadline must be in the future';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError('');
    try {
      await createAssignmentAPI({ ...form, assignedLectures: Number(form.assignedLectures) });
      setSuccess('Assignment created successfully!');
      setTimeout(() => navigate('/ao/assignments'), 1500);
    } catch (err) {
      setApiError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <Card title="Create Lecture Assignment" subtitle="Assign a lecture target to an ANO officer">
        {success && <Alert variant="success" style={{ marginBottom: 20 }}>{success}</Alert>}
        {apiError && <Alert variant="error" onClose={() => setApiError('')} style={{ marginBottom: 20 }}>{apiError}</Alert>}

        {loadingAnos ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spinner label="Loading ANO officers..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Select
              label="Select ANO Officer" name="anoId" required
              value={form.anoId} onChange={handleChange} error={errors.anoId}
            >
              <option value="">— Choose an ANO —</option>
              {anos.map(a => (
                <option key={a._id} value={a._id}>{a.name} — {a.college}</option>
              ))}
            </Select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input
                label="Number of Lectures" name="assignedLectures" type="number"
                min="1" placeholder="e.g. 10" required
                value={form.assignedLectures} onChange={handleChange} error={errors.assignedLectures}
              />
              <Input
                label="Deadline" name="deadline" type="date" required
                value={form.deadline} onChange={handleChange} error={errors.deadline}
              />
            </div>

            <Textarea
              label="Remarks (Optional)" name="remarks"
              placeholder="Any specific instructions or notes..."
              rows={3} value={form.remarks} onChange={handleChange}
            />

            {/* Preview */}
            {form.anoId && form.assignedLectures && (
              <div style={{
                background: '#f0f9ff', border: '1px solid #bae6fd',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0c4a6e', marginBottom: 6 }}>Assignment Preview</div>
                <div style={{ fontSize: '0.8125rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>📌 ANO: <strong>{anos.find(a => a._id === form.anoId)?.name}</strong></div>
                  <div>🎯 Target: <strong>{form.assignedLectures} lectures</strong></div>
                  {form.deadline && <div>📅 Deadline: <strong>{new Date(form.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
              <Button type="submit" loading={submitting} icon="✓">Create Assignment</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/ao/assignments')}>Cancel</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
