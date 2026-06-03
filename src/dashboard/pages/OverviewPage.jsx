import React from 'react';
import { Brain, Users, Target, FlaskConical, TrendingUp, ArrowUpRight, Clock, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const STATS = [
  { label: 'Products',        value: '2',    delta: null        },
  { label: 'Simulations Run', value: '14',   delta: '+3 this week' },
  { label: 'Avg Confidence',  value: '79%',  delta: '+4pp'      },
  { label: 'Open Requirements', value: '8',  delta: null        },
];

const RECENT_ACTIVITY = [
  { icon: Zap,    label: 'Simulation completed',    sub: '"AI Flashcard Launch Impact" — 82% confidence', time: '2m ago',  color: '#6366f1' },
  { icon: Users,  label: 'Boardroom session ready',  sub: 'Should we launch AI flashcards in Q3?',        time: '14m ago', color: '#f97316' },
  { icon: Target, label: 'Competitor analysis added', sub: 'Quizlet — score 71/100',                      time: '1h ago',  color: '#22c55e' },
  { icon: Brain,  label: 'Prediction updated',       sub: 'D30 Retention revised to 58%',                time: '3h ago',  color: '#a855f7' },
];

const QUICK_LINKS = [
  { label: 'Product Brain',           sub: 'Simulate & predict',         icon: Brain,       path: '/dashboard/product-brain', color: '#EEF2FF', iconColor: '#6366f1' },
  { label: 'AI Boardroom',            sub: 'Debate with AI personas',     icon: Users,       path: '/dashboard/boardroom',     color: '#FFF7ED', iconColor: '#f97316' },
  { label: 'Competitor Intelligence', sub: 'Track your landscape',        icon: Target,      path: '/dashboard/competitors',   color: '#F0FDF4', iconColor: '#22c55e' },
  { label: 'Feature Sandbox',         sub: 'Test feature impact',         icon: FlaskConical,path: '/dashboard/sandbox',       color: '#FDF4FF', iconColor: '#a855f7' },
];

export default function OverviewPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Good morning, Alice</h1>
        <p className="db-page-subtitle">Here's what's happening in Acme Corp</p>
      </div>

      {/* Stats */}
      <div className="db-stats-grid">
        {STATS.map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-value">{s.value}</div>
            {s.delta && <div className="db-stat-delta">{s.delta}</div>}
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
              <NavLink
                key={path}
                to={path}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 9, background: '#FAFAF8', border: '1px solid #F0EFEB', textDecoration: 'none', transition: 'border-color 0.15s' }}
              >
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
            <button className="db-card-action">
              <Clock size={11} />
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #F6F5F2' : 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={item.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 530, color: '#111' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.sub}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#bbb', flexShrink: 0, marginTop: 1 }}>{item.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
