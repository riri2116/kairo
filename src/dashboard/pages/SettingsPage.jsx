import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Link2 } from 'lucide-react';

const TABS = [
  { label: 'Profile',       icon: User    },
  { label: 'Notifications', icon: Bell    },
  { label: 'Security',      icon: Shield  },
  { label: 'Appearance',    icon: Palette },
  { label: 'Integrations',  icon: Link2   },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('Profile');

  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Settings</h1>
        <p className="db-page-subtitle">Manage your account and workspace preferences</p>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setTab(label)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 8, border: 'none', background: tab === label ? '#111' : 'none', color: tab === label ? '#fff' : '#666', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ flex: 1 }}>
          <div className="db-card" style={{ marginBottom: 16 }}>
            <div className="db-card-header"><span className="db-card-title">{tab}</span></div>
            {tab === 'Profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['Full name', 'Alice Chen'], ['Email', 'alice@kairo.ai'], ['Job title', 'Product Manager']].map(([label, placeholder]) => (
                  <div key={label}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                    <input defaultValue={placeholder} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E4E0', borderRadius: 8, fontSize: 13.5, color: '#111', background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                ))}
                <div>
                  <button style={{ padding: '9px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer' }}>Save changes</button>
                </div>
              </div>
            )}
            {tab !== 'Profile' && (
              <div className="db-coming-soon" style={{ minHeight: 200 }}>
                <div className="db-coming-soon-badge">{tab}</div>
                <p style={{ fontSize: 13, color: '#aaa' }}>This section is coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
