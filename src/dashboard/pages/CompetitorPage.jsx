import React from 'react';
import { Target, Plus, TrendingUp, TrendingDown } from 'lucide-react';

const COMPETITORS = [
  { name: 'Anki',    score: 62, strengths: 4, weaknesses: 4, analyzedAt: '5/15' },
  { name: 'Quizlet', score: 71, strengths: 4, weaknesses: 3, analyzedAt: '5/15' },
];

export default function CompetitorPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">Competitor Intelligence</h1>
        <p className="db-page-subtitle">Track and analyze your competitive landscape</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer' }}>
          <Plus size={14} /> Add Competitor
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {COMPETITORS.map((c, i) => (
          <div key={i} className="db-card" style={{ marginBottom: 0, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={18} color="#22c55e" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>Analyzed {c.analyzedAt}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'Instrument Serif, serif', fontSize: 28, color: c.score >= 65 ? '#ef4444' : '#22c55e' }}>
                {c.score}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, padding: '8px 10px', background: '#F0FDF4', borderRadius: 7, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontFamily: 'Instrument Serif, serif', color: '#22c55e' }}>{c.strengths}</div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>Strengths</div>
              </div>
              <div style={{ flex: 1, padding: '8px 10px', background: '#FFF7F7', borderRadius: 7, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontFamily: 'Instrument Serif, serif', color: '#ef4444' }}>{c.weaknesses}</div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>Weaknesses</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
