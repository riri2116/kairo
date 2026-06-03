import React from 'react';
import { FileText, Plus } from 'lucide-react';

const REQS = [
  { title: 'AI Card Generation API',       type: 'FEATURE',       priority: 'CRITICAL', status: 'IN_PROGRESS', tags: ['ai','core','api'] },
  { title: 'Spaced Repetition (SM-2)',     type: 'FEATURE',       priority: 'HIGH',     status: 'APPROVED',    tags: ['algorithm','core'] },
  { title: 'User Authentication & Sessions', type: 'FEATURE',     priority: 'CRITICAL', status: 'COMPLETED',   tags: ['auth','done'] },
];

const PRIORITY_COLOR = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#6366f1', LOW: '#888' };
const STATUS_BG = { COMPLETED: '#F0FDF4', APPROVED: '#EEF2FF', IN_PROGRESS: '#FFF7ED', DRAFT: '#F6F5F2', REVIEW: '#FDF4FF' };
const STATUS_COLOR = { COMPLETED: '#22c55e', APPROVED: '#6366f1', IN_PROGRESS: '#f97316', DRAFT: '#888', REVIEW: '#a855f7' };

export default function RequirementsPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Product Requirements</h1>
        <p className="db-page-subtitle">Track features, bugs, and acceptance criteria</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer' }}>
          <Plus size={14} /> New Requirement
        </button>
      </div>
      <div className="db-card">
        {REQS.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', borderBottom: i < REQS.length - 1 ? '1px solid #F6F5F2' : 'none', cursor: 'pointer' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#F6F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={15} color="#888" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 550, color: '#111', marginBottom: 6 }}>{r.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: PRIORITY_COLOR[r.priority], background: `${PRIORITY_COLOR[r.priority]}15`, padding: '2px 7px', borderRadius: 100 }}>{r.priority}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLOR[r.status], background: STATUS_BG[r.status], padding: '2px 7px', borderRadius: 100 }}>{r.status}</span>
                {r.tags.map(t => <span key={t} style={{ fontSize: 11, color: '#aaa', background: '#F6F5F2', padding: '2px 7px', borderRadius: 100 }}>#{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
