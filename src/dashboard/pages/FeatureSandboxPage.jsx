import React from 'react';
import { FlaskConical, Plus, ArrowUp } from 'lucide-react';

const SANDBOXES = [
  { name: 'AI Flashcard Generator', retention: 23, revenue: 31, engagement: 41, effort: 42, risk: 'MEDIUM', status: 'COMPLETED' },
  { name: 'Collaborative Deck Sharing', retention: 12, revenue: 8, engagement: 28, effort: 21, risk: 'LOW', status: 'DRAFT' },
];

const RISK_COLOR = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444' };
const STATUS_BG = { COMPLETED: '#F0FDF4', DRAFT: '#F6F5F2', SIMULATING: '#EEF2FF' };
const STATUS_COLOR = { COMPLETED: '#22c55e', DRAFT: '#888', SIMULATING: '#6366f1' };

export default function FeatureSandboxPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Feature Sandbox</h1>
        <p className="db-page-subtitle">Predict feature impact before you build</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer' }}>
          <Plus size={14} /> New Feature
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SANDBOXES.map((s, i) => (
          <div key={i} className="db-card" style={{ marginBottom: 0, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FlaskConical size={18} color="#a855f7" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 580, color: '#111' }}>{s.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: STATUS_BG[s.status], color: STATUS_COLOR[s.status] }}>{s.status}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: RISK_COLOR[s.risk], background: `${RISK_COLOR[s.risk]}18`, padding: '2px 8px', borderRadius: 100 }}>{s.risk} RISK</span>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  {[['Retention', s.retention], ['Revenue', s.revenue], ['Engagement', s.engagement]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 14, fontWeight: 600, color: '#22c55e' }}><ArrowUp size={11} />+{val}%</div>
                      <div style={{ fontSize: 11, color: '#999' }}>{label}</div>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{s.effort}d</div>
                    <div style={{ fontSize: 11, color: '#999' }}>Effort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
