import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, X, ChevronDown, ChevronRight, Trash2, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import { boardroomApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const STANCE_CONFIG = {
  CHAMPION: { color: '#22c55e', bg: '#22c55e15', label: 'Champion' },
  CAUTIOUS: { color: '#f59e0b', bg: '#f59e0b15', label: 'Cautious' },
  NEUTRAL:  { color: '#6366f1', bg: '#6366f115', label: 'Neutral'  },
  AGAINST:  { color: '#ef4444', bg: '#ef444415', label: 'Against'  },
};

const PERSONA_COLORS = ['#6366f1','#f97316','#22c55e','#a855f7','#0ea5e9'];

function SessionModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ topic: '', question: '' });
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.topic.trim()) return setError('Topic is required.');
    if (form.question.trim().length < 10) return setError('Question needs at least 10 characters.');
    await onSubmit(form);
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal" style={{ maxWidth: 520 }}>
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#f97316,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#fff" />
            </div>
            <div>
              <h2 className="db-modal-title">New Boardroom Session</h2>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>5 AI executives will debate your question</p>
            </div>
          </div>
          {!loading && <button className="db-modal-close" onClick={onClose}><X size={16} /></button>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            <div className="db-form-group">
              <label className="db-form-label">Topic <span className="db-form-required">*</span></label>
              <input className="db-form-input" placeholder="e.g. Should we launch AI flashcards in Q3?" value={form.topic} onChange={e => set('topic', e.target.value)} maxLength={300} disabled={loading} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Question for the board <span className="db-form-required">*</span><span className="db-form-hint"> — provide context for better debate</span></label>
              <textarea className="db-form-input" style={{ minHeight: 120, resize: 'vertical' }} placeholder="Describe the decision you need help with, including key tradeoffs, constraints, and any relevant context..." value={form.question} onChange={e => set('question', e.target.value)} maxLength={2000} disabled={loading} rows={5} />
            </div>
            {error && <div className="db-alert db-alert-error">{error}</div>}
            {loading && (
              <div className="brain-running-state">
                <Loader2 size={20} className="brain-spin" color="#f97316" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Convening the board…</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>5 AI executives are reviewing your question</div>
                </div>
              </div>
            )}
          </div>
          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {loading ? <><Loader2 size={14} className="brain-spin" /> Convening…</> : <><Users size={14} /> Convene Board</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SessionCard({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const votes = session.votes || {};
  const transcript = session.transcript || [];

  async function handleDelete() {
    if (!confirm('Delete this session?')) return;
    setDeleting(true);
    await onDelete(session.id);
  }

  const totalVotes = (votes.champion||0) + (votes.cautious||0) + (votes.neutral||0) + (votes.against||0);

  return (
    <div className={`brain-card${expanded ? ' expanded' : ''}`}>
      <div className="brain-card-header" onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={16} color="#f97316" />
        </div>
        <div className="brain-card-meta">
          <div className="brain-card-title">{session.topic}</div>
          {session.consensus && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 3, fontStyle: 'italic' }}>"{session.consensus}"</div>
          )}
          {totalVotes > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
              {[['champion','#22c55e','▲'], ['cautious','#f59e0b','◈'], ['neutral','#6366f1','○'], ['against','#ef4444','✕']].map(([k, c, icon]) => votes[k] > 0 && (
                <span key={k} style={{ fontSize: 11.5, color: c, fontWeight: 600 }}>{icon} {votes[k]}</span>
              ))}
            </div>
          )}
        </div>
        <div className="brain-card-right">
          <div className="brain-card-date">{new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div className="brain-card-actions" onClick={e => e.stopPropagation()}>
            <button className="brain-action-btn danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 size={14} className="brain-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
          <div className="brain-expand-icon">{expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</div>
        </div>
      </div>

      {expanded && (
        <div className="brain-card-body">
          {session.summary && (
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: '0 0 16px', padding: '12px 14px', background: '#FAFAF8', borderRadius: 8, border: '1px solid #ECEAE7' }}>
              {session.summary}
            </p>
          )}
          <div className="brd-transcript">
            {transcript.map((p, i) => {
              const sc = STANCE_CONFIG[p.stance] || STANCE_CONFIG.NEUTRAL;
              return (
                <div key={i} className="brd-message">
                  <div className="brd-avatar" style={{ background: `${PERSONA_COLORS[i % PERSONA_COLORS.length]}18`, color: PERSONA_COLORS[i % PERSONA_COLORS.length] }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="brd-bubble">
                    <div className="brd-persona">
                      <span className="brd-name">{p.name}</span>
                      <span className="brd-role">{p.role}</span>
                      <span className="brd-stance" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
                    </div>
                    <p className="brd-text">{p.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIBoardroomPage() {
  const { workspaceSlug } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    try { const r = await boardroomApi.list(workspaceSlug); setSessions(r.data || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [workspaceSlug]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleCreate(data) {
    setSubmitting(true);
    try { const r = await boardroomApi.create(workspaceSlug, data); setSessions(p => [r.data, ...p]); setShowModal(false); }
    catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    try { await boardroomApi.delete(id); setSessions(p => p.filter(s => s.id !== id)); }
    catch (e) { setError(e.message); }
  }

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">AI Boardroom</h1><p className="db-page-subtitle">Debate product decisions with AI-simulated executive personas</p></div>
        <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> New Session</button>
      </div>

      <div className="brain-toolbar">
        <span style={{ fontSize: 12, color: '#aaa' }}>{sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}</span>
        <button className="brain-refresh-btn" onClick={fetch}><RefreshCw size={13} /></button>
      </div>

      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="brain-loading">{[1,2,3].map(i => <div key={i} className="brain-skeleton" style={{ height: 80 }} />)}</div>
      ) : sessions.length === 0 ? (
        <div className="brain-empty">
          <div className="brain-empty-icon"><Users size={32} color="#ccc" /></div>
          <h3 className="brain-empty-title">No boardroom sessions yet</h3>
          <p className="brain-empty-subtitle">Submit a topic and 5 AI executives — CEO, CTO, CFO, Head of Product, and Head of Growth — will debate it from their unique perspectives.</p>
          <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Convene First Session</button>
        </div>
      ) : (
        <div className="brain-list">
          {sessions.map(s => <SessionCard key={s.id} session={s} onDelete={handleDelete} />)}
        </div>
      )}

      {showModal && <SessionModal loading={submitting} onClose={() => !submitting && setShowModal(false)} onSubmit={handleCreate} />}
    </>
  );
}
