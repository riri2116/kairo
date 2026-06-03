import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="db-login-page">
      <div className="db-login-card">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, color: '#fff', lineHeight: 1 }}>K</span>
          </div>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: '#111' }}>Kairo</span>
        </div>

        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, fontWeight: 400, color: '#111', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Sign in to your workspace
        </h1>
        <p style={{ fontSize: 13.5, color: '#888', marginBottom: 28, lineHeight: 1.5 }}>
          Enter your credentials to access the dashboard.
        </p>

        {error && (
          <div className="db-alert db-alert-error" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="db-field">
            <label className="db-label">Email</label>
            <input
              className="db-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="db-field">
            <label className="db-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="db-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="db-btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>
            {loading ? <><Loader size={14} className="db-spin" /> Signing in…</> : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12.5, color: '#bbb' }}>
          Don't have an account?{' '}
          <a href="/dashboard/register" style={{ color: '#111', textDecoration: 'underline', fontWeight: 500 }}>
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}
