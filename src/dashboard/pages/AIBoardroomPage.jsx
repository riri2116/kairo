import React from 'react';
import { Users, MessageSquare, CheckCircle, Clock, Plus } from 'lucide-react';

const SESSIONS = [
  { topic: 'Should we launch AI flashcards in Q3?', status: 'COMPLETED', consensus: 'Proceed with phased beta', votes: { champion: 3, cautious: 1, neutral: 1 }, time: '2 days ago' },
  { topic: 'Pricing model: freemium vs. trial',    status: 'PENDING',   consensus: null, votes: null, time: 'Queued' },
];

export default function AIBoardroomPage() {
  return (
    <>
      <div className="db-page-header">
        <h1 className="db-page-title">AI Boardroom</h1>
        <p className="db-page-subtitle">Debate product decisions with AI-simulated executive personas</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: 'pointer' }}>
          <Plus size={14} /> New Session
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SESSIONS.map((s, i) => (
          <div key={i} className="db-card" style={{ marginBottom: 0, cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={18} color="#f97316" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 580, color: '#111', letterSpacing: '-0.01em', marginBottom: 6, lineHeight: 1.3 }}>{s.topic}</div>
                {s.consensus && <div style={{ fontSize: 13, color: '#666', marginBottom: 10 }}>{s.consensus}</div>}
                {s.votes && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>▲ {s.votes.champion} champion</span>
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>◈ {s.votes.cautious} cautious</span>
                    <span style={{ fontSize: 12, color: '#aaa',    fontWeight: 600 }}>○ {s.votes.neutral} neutral</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: s.status === 'COMPLETED' ? '#22c55e' : '#f59e0b', fontWeight: 500 }}>
                  {s.status === 'COMPLETED' ? <CheckCircle size={11} /> : <Clock size={11} />}
                  {s.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                </span>
                <span style={{ fontSize: 11, color: '#bbb' }}>{s.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
