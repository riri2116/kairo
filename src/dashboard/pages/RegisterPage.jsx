import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Eye, EyeOff, Sun, Moon, Check } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../../lib/theme';
import kairoIcon from '../../assets/kairo-icon.png';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',            test: (p) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const passOk = rules.every((r) => r.test(password));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Enter your name.'); return; }
    if (!email.trim()) { setError('Enter your email.'); return; }
    if (!passOk) { setError('Please meet all password requirements.'); return; }

    setLoading(true);
    try {
      const data = await register(name.trim(), email.trim(), password);
      // Seed demo workspace data for new users (fire-and-forget)
      const slug = data?.workspaces?.[0]?.slug;
      if (slug) {
        const token = localStorage.getItem('kairo_token');
        fetch('/api/seed-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ workspaceSlug: slug }),
        }).catch(() => {});
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const issues = err?.data?.issues;
      if (issues) {
        const first = Object.values(issues).flat()[0];
        setError(first || 'Please check the form and try again.');
      } else {
        setError(err.message || 'Could not create your account. Please try again.');
      }
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
          <img src={kairoIcon} alt="Kairo" className="login-brand-logo" />
          <h2 className="login-brand-title">Start building<br />with confidence.</h2>
          <p className="login-brand-sub">
            Create your Kairo workspace and simulate user reactions, market shifts, and
            feature impact — before a single line of code ships.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="login-panel">
        <div className="db-login-card">
          <h1 className="login-card-title">Create your account</h1>
          <p className="login-card-sub">Get your own workspace in seconds. No credit card required.</p>

          {error && (
            <div className="db-alert db-alert-error" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="db-field">
              <label className="db-label">Full name</label>
              <input
                className="db-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                autoFocus
                autoComplete="name"
              />
            </div>

            <div className="db-field">
              <label className="db-label">Email</label>
              <input
                className="db-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                  autoComplete="new-password"
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

              {password.length > 0 && (
                <ul className="login-pass-rules">
                  {rules.map((r) => {
                    const ok = r.test(password);
                    return (
                      <li key={r.label} className={ok ? 'ok' : ''}>
                        <Check size={12} strokeWidth={ok ? 3 : 2} />
                        {r.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button type="submit" className="db-btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>
              {loading ? <><Loader size={14} className="db-spin" /> Creating account…</> : 'Create account'}
            </button>
          </form>

          <div className="login-card-foot">
            Already have an account?{' '}
            <a href="/dashboard/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
