import React, { useState, useEffect } from 'react';
import {
  Brain, Users, Target, FlaskConical, TrendingUp, ArrowUpRight,
  Map, FileText, Package, Zap, Sparkles, Activity, ChevronRight,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { statsApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const TYPE_LABELS = {
  PRODUCT_IDEA: 'Product Idea', FEATURE_IDEA: 'Feature Idea',
  PRICING_CHANGE: 'Pricing Change', GROWTH_EXPERIMENT: 'Growth Experiment',
};
const TYPE_COLOR = { PRODUCT_IDEA: '#6366f1', FEATURE_IDEA: '#8b5cf6', PRICING_CHANGE: '#10b981', GROWTH_EXPERIMENT: '#f59e0b' };
const RISK_COLOR = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#7c2d12' };

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ANALYSIS_TOOLS = [
  {
    label: 'Product Brain',
    sub: 'Simulate ideas & predict outcomes',
    icon: Brain,
    path: '/dashboard/product-brain',
    gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: '#6366f1',
    accentColor: '#6366f1',
  },
  {
    label: 'AI Boardroom',
    sub: 'Debate with 5 AI executives',
    icon: Users,
    path: '/dashboard/boardroom',
    gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    iconBg: 'rgba(249,115,22,0.12)',
    iconColor: '#f97316',
    accentColor: '#f97316',
  },
  {
    label: 'Emotion Simulator',
    sub: 'Map your user emotional journey',
    icon: Activity,
    path: '/dashboard/emotion-simulator',
    gradient: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)',
    iconBg: 'rgba(168,85,247,0.12)',
    iconColor: '#a855f7',
    accentColor: '#a855f7',
  },
  {
    label: 'Feature Sandbox',
    sub: 'Assess impact before you build',
    icon: FlaskConical,
    path: '/dashboard/sandbox',
    gradient: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    iconBg: 'rgba(34,197,94,0.12)',
    iconColor: '#22c55e',
    accentColor: '#22c55e',
  },
];

const STAT_ACCENTS = ['#6366f1', '#f97316', '#10b981', '#a855f7'];

function MiniBar({ pct, color }) {
  const heights = [0.4, 0.6, 0.5, 0.75, 0.65, 0.85, 0.8, 1.0].map(h => Math.round(h * pct));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 3, height: `${Math.max(4, h)}%`, maxHeight: 24,
          minHeight: 4, background: i === 7 ? color : `${color}30`,
          borderRadius: 2, transition: 'height 0.4s ease',
        }} />
      ))}
    </div>
  );
}

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
    {
      label: 'Products',
      value: loading ? '—' : counts.products ?? 0,
      sub: 'in workspace',
      color: STAT_ACCENTS[0],
      pct: Math.min(100, (counts.products ?? 0) * 20),
    },
    {
      label: 'Brain Analyses',
      value: loading ? '—' : counts.brainAnalyses ?? 0,
      sub: `${loading ? '—' : counts.completedBrain ?? 0} completed`,
      color: STAT_ACCENTS[1],
      pct: Math.min(100, (counts.brainAnalyses ?? 0) * 15),
    },
    {
      label: 'AI Confidence',
      value: loading ? '—' : metrics.avgConfidence != null ? `${metrics.avgConfidence}%` : '—',
      sub: 'average score',
      color: STAT_ACCENTS[2],
      pct: metrics.avgConfidence ?? 0,
    },
    {
      label: 'Open Requirements',
      value: loading ? '—' : counts.openRequirements ?? 0,
      sub: `${loading ? '—' : counts.requirements ?? 0} total`,
      color: STAT_ACCENTS[3],
      pct: Math.min(100, (counts.openRequirements ?? 0) * 10),
    },
  ];

  const recentItems = [
    ...(activity.brain || []).map(a => ({
      icon: Brain, color: TYPE_COLOR[a.submissionType] || '#6366f1',
      label: a.title,
      sub: TYPE_LABELS[a.submissionType] || a.submissionType,
      time: timeAgo(a.createdAt), badge: 'Brain',
    })),
    ...(activity.boardroom || []).map(a => ({
      icon: Users, color: '#f97316',
      label: a.topic, sub: a.consensus || 'Session completed',
      time: timeAgo(a.createdAt), badge: 'Boardroom',
    })),
    ...(activity.competitors || []).map(a => ({
      icon: Target, color: '#22c55e',
      label: a.competitorName, sub: `Threat score ${a.score}/100`,
      time: timeAgo(a.createdAt), badge: 'Competitor',
    })),
    ...(activity.sandboxes || []).map(a => ({
      icon: FlaskConical, color: '#a855f7',
      label: a.featureName,
      sub: `+${a.retentionImpact}% retention · ${a.riskLevel?.toLowerCase() ?? ''} risk`,
      time: timeAgo(a.createdAt), badge: 'Sandbox',
    })),
    ...(activity.requirements || []).map(a => ({
      icon: FileText, color: '#6366f1',
      label: a.title, sub: `${a.priority} priority · ${a.status}`,
      time: timeAgo(a.createdAt), badge: 'Req',
    })),
  ].slice(0, 8);

  const hasData = !loading && (counts.brainAnalyses > 0 || counts.products > 0);

  return (
    <>
      {/* ── Hero header ──────────────────────────────────────────────── */}
      <div className="ov-hero">
        <div className="ov-hero-left">
          <div className="ov-hero-eyebrow">
            <Sparkles size={12} />
            Intelligence workspace
          </div>
          <h1 className="ov-hero-title">{greeting}, {firstName}</h1>
          <p className="ov-hero-sub">
            {loading
              ? 'Loading your workspace…'
              : hasData
                ? `${counts.brainAnalyses ?? 0} analyses · ${counts.boardroomSessions ?? 0} boardroom sessions · ${counts.sandboxes ?? 0} simulations`
                : 'Your product intelligence workspace is ready — run your first analysis below.'
            }
          </p>
        </div>
        <NavLink to="/dashboard/product-brain" className="ov-hero-cta">
          <Zap size={14} />
          New analysis
        </NavLink>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────── */}
      <div className="ov-stats">
        {statCards.map((s, i) => (
          <div key={s.label} className="ov-stat-card" style={{ '--accent': s.color }}>
            <div className="ov-stat-top">
              <div className="ov-stat-label">{s.label}</div>
              <MiniBar pct={s.pct} color={s.color} />
            </div>
            <div className="ov-stat-value">{s.value}</div>
            <div className="ov-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="ov-grid">

        {/* Analysis tools */}
        <div className="db-card" style={{ marginBottom: 0 }}>
          <div className="db-card-header">
            <span className="db-card-title">Start an analysis</span>
            <span className="db-card-action">AI-powered tools</span>
          </div>
          <div className="ov-tools-grid">
            {ANALYSIS_TOOLS.map(({ label, sub, icon: Icon, path, gradient, iconBg, iconColor, accentColor }) => (
              <NavLink
                key={path}
                to={path}
                className="ov-tool-card"
                style={{ '--tool-gradient': gradient, '--tool-accent': accentColor }}
              >
                <div className="ov-tool-icon" style={{ background: iconBg }}>
                  <Icon size={16} color={iconColor} />
                </div>
                <div className="ov-tool-body">
                  <div className="ov-tool-label">{label}</div>
                  <div className="ov-tool-sub">{sub}</div>
                </div>
                <ChevronRight size={14} className="ov-tool-arrow" />
              </NavLink>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="db-card" style={{ marginBottom: 0 }}>
          <div className="db-card-header">
            <span className="db-card-title">Recent activity</span>
            {recentItems.length > 0 && (
              <span className="db-card-action" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {recentItems.length} events
              </span>
            )}
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3,4].map(i => <div key={i} className="brain-skeleton" style={{ height: 52 }} />)}
            </div>
          ) : recentItems.length === 0 ? (
            <div className="ov-empty-activity">
              <div className="ov-empty-icon"><Brain size={20} /></div>
              <p className="ov-empty-title">No activity yet</p>
              <p className="ov-empty-sub">Run your first analysis to populate the feed.</p>
            </div>
          ) : (
            <div className="ov-activity-list">
              {recentItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="ov-activity-item" style={{ '--item-color': item.color }}>
                    <div className="ov-activity-icon">
                      <Icon size={13} />
                    </div>
                    <div className="ov-activity-body">
                      <div className="ov-activity-label">{item.label}</div>
                      <div className="ov-activity-sub">{item.sub}</div>
                    </div>
                    <div className="ov-activity-right">
                      <span className="ov-activity-badge">{item.badge}</span>
                      <span className="ov-activity-time">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Feature tiles ────────────────────────────────────────────── */}
      <div className="ov-tiles">
        {[
          { icon: Map,        label: 'Roadmaps',     count: counts.roadmaps,     path: '/dashboard/roadmaps',     color: '#22c55e' },
          { icon: FileText,   label: 'Requirements', count: counts.requirements, path: '/dashboard/requirements', color: '#6366f1' },
          { icon: Package,    label: 'Products',     count: counts.products,     path: '/dashboard/products',     color: '#f97316' },
          { icon: Target,     label: 'Competitors',  count: counts.competitors,  path: '/dashboard/competitors',  color: '#ec4899' },
          { icon: TrendingUp, label: 'Analytics',    count: null,                path: '/dashboard/analytics',    color: '#a855f7' },
        ].map(({ icon: Icon, label, count, path, color }) => (
          <NavLink key={path} to={path} className="ov-tile" style={{ '--tile-color': color }}>
            <div className="ov-tile-icon">
              <Icon size={14} color={color} />
            </div>
            <div className="ov-tile-label">{label}</div>
            {count != null && !loading && (
              <div className="ov-tile-count">{count}</div>
            )}
            <ArrowUpRight size={11} className="ov-tile-arrow" />
          </NavLink>
        ))}
      </div>
    </>
  );
}
