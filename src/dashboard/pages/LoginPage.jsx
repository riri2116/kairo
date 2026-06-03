import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../../lib/theme';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();

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
    <div className={`login-shell ${theme}`}>
      <button
        type="button"
        className="login-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to night mode' : 'Switch to day mode'}
      >
        {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        <span>{theme === 'light' ? 'Night' : 'Day'}</span>
      </button>

      {/* Brand side */}
      <div className="login-brand">
        <span className="login-brand-orb o1" />
        <span className="login-brand-orb o2" />
        <span className="login-brand-orb o3" />
        <div className="login-brand-content">
          <div className="login-brand-mark">K</div>
          <h2 className="login-brand-title">Product intelligence,<br />before you build.</h2>
          <p className="login-brand-sub">
            Kairo simulates user reactions, market shifts, and feature impact — so every
            decision is tested before a single line of code ships.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="login-panel">
        <div className="db-login-card">
          <h1 className="login-card-title">Sign in to your workspace</h1>
          <p className="login-card-sub">Welcome back. Enter your credentials to continue.</p>

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
                  className="login-eye"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="db-btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>
              {loading ? <><Loader size={14} className="db-spin" /> Signing in…</> : 'Sign in'}
            </button>
          </form>

          <div className="login-card-foot">
            Don't have an account?{' '}
            <a href="/dashboard/register">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
