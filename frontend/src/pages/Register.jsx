import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { errMsg } from '../utils/format';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ANO', college: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'AO' ? '/ao/dashboard' : '/ano/dashboard', { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f9ff 50%, #f9fafb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1.5rem',
            margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(26,86,219,.3)',
          }}>N</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Create Account</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: '0.875rem' }}>Join the NCC Administration portal</p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 16, padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,.08)', border: '1px solid #e5e7eb',
        }}>
          {error && <Alert variant="error" onClose={() => setError('')}>{error}</Alert>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: error ? 16 : 0 }}>
            <Input label="Full Name" name="name" placeholder="Maj. Rajesh Kumar" required value={form.name} onChange={handleChange} />
            <Input label="Email Address" name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" placeholder="Min. 6 characters" required value={form.password} onChange={handleChange} />

            <Select label="Role" name="role" required value={form.role} onChange={handleChange}>
              <option value="ANO">ANO — Associate NCC Officer</option>
              <option value="AO">AO — Admin Officer</option>
            </Select>

            <Input label="College / Unit" name="college" placeholder="e.g. Government College, Pune" required value={form.college} onChange={handleChange} />

            <Button type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: 4 }}>
              Create Account
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
