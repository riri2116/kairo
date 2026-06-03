import React, { useState } from 'react';
import { User, Bell, Shield, Zap, Globe, Check } from 'lucide-react';
import { useAuth } from '../lib/auth';

const TABS = [
  { label: 'Profile',      icon: User   },
  { label: 'Workspace',    icon: Globe  },
  { label: 'AI & Integrations', icon: Zap    },
  { label: 'Notifications', icon: Bell  },
  { label: 'Security',     icon: Shield },
];

export default function SettingsPage() {
  const { user, workspaceSlug } = useAuth();
  const [tab, setTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    jobTitle: '',
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Settings</h1><p className="db-page-subtitle">Manage your account and workspace preferences</p></div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar nav */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setTab(label)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 8, border: 'none', background: tab === label ? 'var(--inverse-surface)' : 'none', color: tab === label ? 'var(--inverse-text)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ flex: 1 }}>
          {tab === 'Profile' && (
            <div className="db-card" style={{ marginBottom: 0 }}>
              <div className="db-card-header"><span className="db-card-title">Profile</span></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0 20px' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--inverse-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, color: 'var(--inverse-text)' }}>
                    {(profile.name || profile.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{profile.name || '—'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{profile.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['Full name', 'name', 'text', 'e.g. Alex Johnson'],
                  ['Email address', 'email', 'email', 'you@example.com'],
                  ['Job title', 'jobTitle', 'text', 'e.g. Head of Product'],
                ].map(([label, key, type, placeholder]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                    <input type={type} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, color: 'var(--text-primary)', background: 'var(--surface)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#111'} onBlur={e => e.target.style.borderColor = '#E5E4E0'} />
                  </div>
                ))}
                <div>
                  <button onClick={handleSave} className="db-btn db-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {saved ? <><Check size={14} /> Saved!</> : 'Save changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'Workspace' && (
            <div className="db-card" style={{ marginBottom: 0 }}>
              <div className="db-card-header"><span className="db-card-title">Workspace</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ['Workspace slug', workspaceSlug || '—'],
                  ['Plan', 'FREE'],
                  ['Members', '1'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'AI & Integrations' && (
            <div className="db-card" style={{ marginBottom: 0 }}>
              <div className="db-card-header"><span className="db-card-title">AI & Integrations</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: '14px', background: '#FFFBEB', border: '1px solid #fed7aa', borderRadius: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>OpenAI — Mock mode active</div>
                  <p style={{ fontSize: 12.5, color: '#78350f', margin: 0, lineHeight: 1.6 }}>
                    Product Brain, AI Boardroom, Competitor Intelligence, and Feature Sandbox are running on realistic mock AI responses. To connect live GPT-4o, add your <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 4 }}>OPENAI_API_KEY</code> in Replit Secrets and set <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 4 }}>MOCK_MODE = false</code> in <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 4 }}>backend/src/lib/openai.ts</code>.
                  </p>
                </div>
                {[
                  { name: 'OpenAI GPT-4o', status: 'Mock mode', color: '#f59e0b' },
                  { name: 'PostgreSQL',    status: 'Connected',  color: '#22c55e' },
                ].map(i => (
                  <div key={i.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{i.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: i.color, background: `${i.color}18`, padding: '3px 10px', borderRadius: 100 }}>{i.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tab === 'Notifications' || tab === 'Security') && (
            <div className="db-card" style={{ marginBottom: 0 }}>
              <div className="db-card-header"><span className="db-card-title">{tab}</span></div>
              <div className="db-coming-soon" style={{ minHeight: 200 }}>
                <div className="db-coming-soon-badge">{tab}</div>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 8 }}>This section is coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
