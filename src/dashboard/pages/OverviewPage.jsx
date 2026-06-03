import React, { useState, useEffect } from 'react';
import { Brain, Users, Target, FlaskConical, TrendingUp, ArrowUpRight, Map, FileText, Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { statsApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const TYPE_LABELS = {
  PRODUCT_IDEA: 'Product Idea', FEATURE_IDEA: 'Feature Idea',
  PRICING_CHANGE: 'Pricing Change', GROWTH_EXPERIMENT: 'Growth Experiment',
};
const TYPE_COLOR = { PRODUCT_IDEA: '#6366f1', FEATURE_IDEA: '#8b5cf6', PRICING_CHANGE: '#10b981', GROWTH_EXPERIMENT: '#f59e0b' };
const RISK_COLOR = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#7c2d12' };
const PRIORITY_COLOR = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#6366f1', LOW: '#888' };

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const QUICK_LINKS = [
  { label: 'Product Brain',           sub: 'AI-powered idea analysis',     icon: Brain,        path: '/dashboard/product-brain', color: '#EEF2FF', iconColor: '#6366f1' },
  { label: 'AI Boardroom',            sub: 'Debate with 5 AI executives',  icon: Users,        path: '/dashboard/boardroom',     color: '#FFF7ED', iconColor: '#f97316' },
  { label: 'Competitor Intelligence', sub: 'AI SWOT analysis',             icon: Target,       path: '/dashboard/competitors',   color: '#F0FDF4', iconColor: '#22c55e' },
  { label: 'Feature Sandbox',         sub: 'Predict feature impact',       icon: FlaskConical, path: '/dashboard/sandbox',       color: '#FDF4FF', iconColor: '#a855f7' },
];

export default function OverviewPage() {
  const { user, workspaceSlug } = useAuth();
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
  const activity = stats?.recentActivity || {};

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Products',           value: loading ? '—' : counts.products ?? 0 },
    { label: 'Brain Analyses',     value: loading ? '—' : counts.brainAnalyses ?? 0 },
    { label: 'Avg AI Confidence',  value: loading ? '—' : metrics.avgConfidence != null ? `${metrics.avgConfidence}%` : '—' },
    { label: 'Open Requirements',  value: loading ? '—' : counts.openRequirements ?? 0 },
  ];

  // Merge recent activity into a flat list with type info
  const recentItems = [
    ...(activity.brain || []).map(a => ({
      icon: Brain, color: TYPE_COLOR[a.submissionType] || '#6366f1',
      label: `Brain analysis: ${a.title}`,
      sub: TYPE_LABELS[a.submissionType] || a.submissionType,
      time: timeAgo(a.createdAt),
    })),
    ...(activity.boardroom || []).map(a => ({
      icon: Users, color: '#f97316',
      label: `Boardroom: ${a.topic}`,
      sub: a.consensus || 'Session completed',
      time: timeAgo(a.createdAt),
    })),
    ...(activity.competitors || []).map(a => ({
      icon: Target, color: '#22c55e',
      label: `Competitor: ${a.competitorName}`,
      sub: `Threat score ${a.score}/100`,
      time: timeAgo(a.createdAt),
    })),
    ...(activity.sandboxes || []).map(a => ({
      icon: FlaskConical, color: '#a855f7',
      label: `Sandbox: ${a.featureName}`,
      sub: `+${a.retentionImpact}% retention · ${RISK_COLOR[a.riskLevel] ? a.riskLevel + ' risk' : ''}`,
      time: timeAgo(a.createdAt),
    })),
    ...(activity.requirements || []).map(a => ({
      icon: FileText, color: PRIORITY_COLOR[a.priority] || '#6366f1',
      label: a.title,
      sub: `${a.priority} priority · ${a.status}`,
      time: timeAgo(a.createdAt),
    })),
  ].sort((a, b) => 0).slice(0, 6);

  return (
    <>
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">{greeting}, {firstName}</h1>
          <p className="db-page-subtitle">
            {loading ? 'Loading your workspace…' :
              counts.brainAnalyses > 0
                ? `${counts.brainAnalyses} analyses · ${counts.competitors || 0} competitors · ${counts.sandboxes || 0} simulations`
                : 'Your product intelligence workspace is ready'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="db-stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Quick Actions */}
        <div className="db-card" style={{ marginBottom: 0 }}>
          <div className="db-card-header">
            <span className="db-card-title">Quick actions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {QUICK_LINKS.map(({ label, sub, icon: Icon, path, color, iconColor }) => (
              <NavLink key={path} to={path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 9, background: '#FAFAF8', border: '1px solid #F0EFEB', textDecoration: 'none', transition: 'border-color 0.15s' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={iconColor} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 550, color: '#111', letterSpacing: '-0.01em' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{sub}</div>
                </div>
                <ArrowUpRight size={13} style={{ marginLeft: 'auto', color: '#ccc' }} />
              </NavLink>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="db-card" style={{ marginBottom: 0 }}>
          <div className="db-card-header">
            <span className="db-card-title">Recent activity</span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: 44, borderRadius: 8, background: '#F6F5F2' }} className="brain-skeleton" />)}
            </div>
          ) : recentItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#bbb', fontSize: 13 }}>
              No activity yet — start by running an analysis or creating a product.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < recentItems.length - 1 ? '1px solid #F6F5F2' : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={item.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 530, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.sub}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#bbb', flexShrink: 0, marginTop: 1 }}>{item.time}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Feature area tiles */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { icon: Map,      label: 'Roadmaps',     count: counts.roadmaps,     path: '/dashboard/roadmaps',     color: '#22c55e', bg: '#F0FDF4' },
          { icon: FileText, label: 'Requirements', count: counts.requirements, path: '/dashboard/requirements', color: '#6366f1', bg: '#EEF2FF' },
          { icon: Package,  label: 'Products',     count: counts.products,     path: '/dashboard/products',     color: '#f97316', bg: '#FFF7ED' },
          { icon: TrendingUp,label:'Analytics',    count: null,                path: '/dashboard/analytics',    color: '#a855f7', bg: '#FDF4FF' },
        ].map(({ icon: Icon, label, count, path, color, bg }) => (
          <NavLink key={path} to={path} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#fff', border: '1.5px solid #E5E4E0', borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E4E0'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={15} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 550, color: '#111' }}>{label}</div>
              {count != null && !loading && <div style={{ fontSize: 11.5, color: '#aaa' }}>{count} {label.toLowerCase()}</div>}
            </div>
            <ArrowUpRight size={12} style={{ marginLeft: 'auto', color: '#ddd' }} />
          </NavLink>
        ))}
      </div>
    </>
  );
}
