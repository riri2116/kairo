import React, { useState, useEffect } from 'react';
import { BarChart2, Brain, Users, Target, FlaskConical, TrendingUp, FileText, Map } from 'lucide-react';
import { statsApi } from '../lib/api';
import { useAuth } from '../lib/auth';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-label">{label}</div>
      <div className="db-stat-value" style={color ? { color } : {}}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function MetricBar({ label, value, max, color, icon: Icon }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F6F5F2' }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 530, color: '#111', marginBottom: 5 }}>{label}</div>
        <div style={{ height: 4, background: '#F0EFEC', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: '#111', lineHeight: 1, flexShrink: 0, minWidth: 40, textAlign: 'right' }}>
        {value}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { workspaceSlug } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceSlug) return;
    statsApi.get(workspaceSlug)
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [workspaceSlug]);

  const counts = stats?.counts || {};
  const metrics = stats?.metrics || {};
  const total = Object.values(counts).reduce((s, v) => s + (v || 0), 0);

  const featureMetrics = [
    { label: 'Products',            value: counts.products          || 0, color: '#f97316', icon: BarChart2  },
    { label: 'Brain Analyses',      value: counts.brainAnalyses     || 0, color: '#6366f1', icon: Brain      },
    { label: 'Boardroom Sessions',  value: counts.boardroomSessions || 0, color: '#f97316', icon: Users      },
    { label: 'Competitor Analyses', value: counts.competitors       || 0, color: '#22c55e', icon: Target     },
    { label: 'Feature Simulations', value: counts.sandboxes         || 0, color: '#a855f7', icon: FlaskConical },
    { label: 'Roadmaps',            value: counts.roadmaps          || 0, color: '#22c55e', icon: Map        },
    { label: 'Requirements',        value: counts.requirements      || 0, color: '#6366f1', icon: FileText   },
  ];
  const maxCount = Math.max(...featureMetrics.map(m => m.value), 1);

  if (loading) return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Analytics</h1><p className="db-page-subtitle">Workspace usage and AI performance metrics</p></div>
      </div>
      <div className="brain-loading">{[1,2,3].map(i => <div key={i} className="brain-skeleton" style={{ height: 80 }} />)}</div>
    </>
  );

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Analytics</h1><p className="db-page-subtitle">Workspace usage and AI performance metrics</p></div>
      </div>

      <div className="db-stats-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Total workspace actions" value={total} sub="across all features" />
        <StatCard label="AI analyses completed" value={counts.completedBrain || 0} sub="Product Brain" color="#6366f1" />
        <StatCard label="Avg AI confidence" value={metrics.avgConfidence != null ? `${metrics.avgConfidence}%` : '—'} sub="from completed analyses" color={metrics.avgConfidence >= 75 ? '#22c55e' : '#f59e0b'} />
        <StatCard label="Avg retention impact" value={metrics.avgRetentionImpact != null ? `+${metrics.avgRetentionImpact}%` : '—'} sub="from feature simulations" color="#a855f7" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="db-card" style={{ marginBottom: 0 }}>
          <div className="db-card-header"><span className="db-card-title">Feature usage</span></div>
          {featureMetrics.map(m => (
            <MetricBar key={m.label} label={m.label} value={m.value} max={maxCount} color={m.color} icon={m.icon} />
          ))}
        </div>

        <div className="db-card" style={{ marginBottom: 0 }}>
          <div className="db-card-header"><span className="db-card-title">Requirements overview</span></div>
          {[
            ['Total requirements', counts.requirements || 0, '#111'],
            ['Open / in-progress', counts.openRequirements || 0, '#f59e0b'],
            ['Completed', (counts.requirements || 0) - (counts.openRequirements || 0), '#22c55e'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F6F5F2' }}>
              <span style={{ fontSize: 13, color: '#555' }}>{label}</span>
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color, lineHeight: 1 }}>{val}</span>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <div className="db-card-header" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="db-card-title">Sandbox metrics</span></div>
            {[
              ['Simulations run', counts.sandboxes || 0],
              ['Completed', counts.completedSandboxes || 0],
              ['Avg retention uplift', metrics.avgRetentionImpact != null ? `+${metrics.avgRetentionImpact}%` : '—'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F6F5F2' }}>
                <span style={{ fontSize: 13, color: '#555' }}>{label}</span>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: '#111', lineHeight: 1 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
