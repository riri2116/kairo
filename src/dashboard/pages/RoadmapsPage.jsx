import React from 'react';
import { Map, Plus, CheckCircle, Clock, Circle } from 'lucide-react';

const ITEMS = [
  { title: 'AI Flashcard Generator (v1)', priority: 'CRITICAL', status: 'IN_PROGRESS', due: 'Jul 31' },
  { title: 'Onboarding Redesign',         priority: 'HIGH',     status: 'PLANNED',     due: 'Aug 15' },
  { title: 'Streak & Gamification',       priority: 'MEDIUM',   status: 'PLANNED',     due: 'Sep 15' },
  { title: 'Offline Study Mode',          priority: 'MEDIUM',   status: 'PLANNED',     due: 'Sep 30' },
];

const PRIORITY_COLOR = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#6366f1', LOW: '#888' };
const STATUS_ICON = { COMPLETED: CheckCircle, IN_PROGRESS: Clock, PLANNED: Circle, BLOCKED: Circle };
const STATUS_COLOR = { COMPLETED: '#22c55e', IN_PROGRESS: '#6366f1', PLANNED: '#bbb', BLOCKED: '#ef4444' };

export default function RoadmapsPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Roadmaps</h1>
        <p className="db-page-subtitle">Q3 2025 — AI-First Expansion</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer' }}>
          <Plus size={14} /> Add Item
        </button>
      </div>
      <div className="db-card">
        <div className="db-card-header">
          <span className="db-card-title">Q3 2025 — AI-First Expansion</span>
          <span style={{ fontSize: 12, padding: '3px 10px', background: '#F0FDF4', color: '#22c55e', borderRadius: 100, fontWeight: 600 }}>ACTIVE</span>
        </div>
        {ITEMS.map((item, i) => {
          const StatusIcon = STATUS_ICON[item.status];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < ITEMS.length - 1 ? '1px solid #F6F5F2' : 'none' }}>
              <StatusIcon size={15} color={STATUS_COLOR[item.status]} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 520, color: '#111' }}>{item.title}</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY_COLOR[item.priority], background: `${PRIORITY_COLOR[item.priority]}15`, padding: '2px 8px', borderRadius: 100, flexShrink: 0 }}>{item.priority}</span>
              <span style={{ fontSize: 12, color: '#aaa', flexShrink: 0, minWidth: 50, textAlign: 'right' }}>{item.due}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
