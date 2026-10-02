import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { errMsg } from '../utils/format';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
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
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1.5rem',
            margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(26,86,219,.3)',
          }}>N</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>NCC Administration</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: '0.875rem' }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,.08)', border: '1px solid #e5e7eb',
        }}>
          {error && <Alert variant="error" onClose={() => setError('')} style={{ marginBottom: 20 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input
              label="Email Address" name="email" type="email"
              placeholder="you@example.com" required
              value={form.email} onChange={handleChange}
            />
            <Input
              label="Password" name="password" type="password"
              placeholder="Enter your password" required
              value={form.password} onChange={handleChange}
            />
            <Button type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: 4 }}>
              Sign In
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
