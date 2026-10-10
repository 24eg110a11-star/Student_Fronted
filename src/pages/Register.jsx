import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';

const initial = { name: '', email: '', password: '', confirmPassword: '', department: '', rollNumber: '' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return setError('Please fill all required fields.');
    setBusy(true); setError('');
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    } finally { setBusy(false); }
  };

  const field = (name, label, type = 'text') => (
    <label>{label}
      <input type={type} name={name} value={form[name]} onChange={change} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </label>
  );

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={submit} noValidate>
        <h1>Create Account</h1>
        <Alert>{error}</Alert>
        {field('name', 'Full Name')}
        {field('email', 'Email', 'email')}
        <div className="grid-2">
          {field('rollNumber', 'Roll Number')}
          {field('department', 'Department')}
        </div>
        <div className="grid-2">
          {field('password', 'Password', 'password')}
          {field('confirmPassword', 'Confirm Password', 'password')}
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Registering...' : 'Register'}</button>
        <Link className="btn btn-light btn-block" to="/login">Back to Login</Link>
      </form>
    </div>
  );
}
