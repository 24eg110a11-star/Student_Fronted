import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!form.email.trim() || !form.password) return setError('Please fill all required fields.');
    setBusy(true); setError('');
    try {
      await login(form.email.trim(), form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.status === 401 ? 'Invalid login credentials.' : errorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit} noValidate>
        <div className="auth-logo">🎓</div>
        <h1>Student Task Management</h1>
        <p className="muted">Sign in to manage your academic tasks</p>
        <Alert>{error}</Alert>
        <label>Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" />
        </label>
        <label>Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
        <p className="center">New student? <Link className="link" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
