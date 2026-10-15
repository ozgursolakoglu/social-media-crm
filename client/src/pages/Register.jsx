import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.register(form);
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: 400, maxWidth: '90%' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Social Media <span style={{ color: '#2563eb' }}>CRM</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label">Name <User size={16} style={{ marginLeft: '0.5rem', color: '#2563eb' }} /></div>
            <input className="input" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <div className="label">Email <Mail size={16} style={{ marginLeft: '0.5rem', color: '#2563eb' }} /></div>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <div className="label">Password <Lock size={16} style={{ marginLeft: '0.5rem', color: '#2563eb' }} /></div>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}