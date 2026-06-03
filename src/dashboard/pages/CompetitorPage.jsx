import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, X, Trash2, Loader2, RefreshCw, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { competitorsApi } from '../lib/api';
import { useAuth } from '../lib/auth';

function ScoreRing({ score }) {
  const color = score >= 70 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#22c55e';
  return (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 10, color: '#aaa', fontWeight: 600, letterSpacing: '0.05em' }}>THREAT SCORE</div>
    </div>
  );
}

function CompetitorModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ competitorName: '', competitorUrl: '', notes: '' });
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.competitorName.trim()) return setError('Competitor name is required.');
    await onSubmit(form);
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal" style={{ maxWidth: 480 }}>
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} color="#22c55e" />
            </div>
            <div>
              <h2 className="db-modal-title">Analyze Competitor</h2>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>AI-generated SWOT analysis</p>
            </div>
          </div>
          {!loading && <button className="db-modal-close" onClick={onClose}><X size={16} /></button>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            <div className="db-field-row">
              <div className="db-form-group">
                <label className="db-form-label">Competitor name <span className="db-form-required">*</span></label>
                <input className="db-form-input" placeholder="e.g. Notion, Linear, Figma" value={form.competitorName} onChange={e => set('competitorName', e.target.value)} disabled={loading} />
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Website URL</label>
                <input className="db-form-input" placeholder="https://example.com" value={form.competitorUrl} onChange={e => set('competitorUrl', e.target.value)} disabled={loading} />
              </div>
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Notes <span className="db-form-hint">— additional context for analysis</span></label>
              <textarea className="db-form-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Any specific areas to focus on, recent news, etc." value={form.notes} onChange={e => set('notes', e.target.value)} disabled={loading} rows={3} />
            </div>
            {error && <div className="db-alert db-alert-error">{error}</div>}
            {loading && (
              <div className="brain-running-state">
                <Loader2 size={20} className="brain-spin" color="#22c55e" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Analyzing competitor…</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Generating SWOT analysis</div>
                </div>
              </div>
            )}
          </div>
          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {loading ? <><Loader2 size={14} className="brain-spin" /> Analyzing…</> : <><Target size={14} /> Run Analysis</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SWOT_CONFIG = [
  { key: 'strengths',     label: 'Strengths',     color: '#22c55e', bg: '#F0FDF4', border: '#bbf7d0' },
  { key: 'weaknesses',    label: 'Weaknesses',    color: '#ef4444', bg: '#FFF5F5', border: '#fecaca' },
  { key: 'opportunities', label: 'Opportunities', color: '#6366f1', bg: '#EEF2FF', border: '#c7d2fe' },
  { key: 'threats',       label: 'Threats',       color: '#f59e0b', bg: '#FFFBEB', border: '#fed7aa' },
];

function CompetitorCard({ competitor, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete ${competitor.competitorName}?`)) return;
    setDeleting(true);
    await onDelete(competitor.id);
  }

  const score = competitor.score || 0;
  const scoreColor = score >= 70 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#22c55e';

  return (
    <div className={`brain-card${expanded ? ' expanded' : ''}`}>
      <div className="brain-card-header" onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Target size={16} color="#22c55e" />
        </div>
        <div className="brain-card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="brain-card-title" style={{ marginBottom: 0 }}>{competitor.competitorName}</div>
            {competitor.competitorUrl && (
              <a href={competitor.competitorUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#aaa', display: 'flex', alignItems: 'center' }}>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <span style={{ fontSize: 11.5, color: '#888' }}>{(competitor.strengths || []).length} strengths</span>
            <span style={{ fontSize: 11.5, color: '#888' }}>{(competitor.weaknesses || []).length} weaknesses</span>
            <span style={{ fontSize: 11.5, color: '#888' }}>Analyzed {new Date(competitor.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="brain-card-right">
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, color: scoreColor, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 10, color: '#bbb', fontWeight: 600, letterSpacing: '0.04em' }}>THREAT</div>
          </div>
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
          <div className="swot-grid">
            {SWOT_CONFIG.map(({ key, label, color, bg, border }) => (
              <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 15px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(competitor[key] || []).map((item, i) => (
                    <li key={i} style={{ fontSize: 12.5, color: '#333', lineHeight: 1.5, display: 'flex', gap: 7 }}>
                      <span style={{ color, flexShrink: 0, marginTop: 2 }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompetitorPage() {
  const { workspaceSlug } = useAuth();
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    try { const r = await competitorsApi.list(workspaceSlug); setCompetitors(r.data || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [workspaceSlug]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleCreate(data) {
    setSubmitting(true);
    try { const r = await competitorsApi.create(workspaceSlug, data); setCompetitors(p => [r.data, ...p]); setShowModal(false); }
    catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    try { await competitorsApi.delete(id); setCompetitors(p => p.filter(c => c.id !== id)); }
    catch (e) { setError(e.message); }
  }

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Competitor Intelligence</h1><p className="db-page-subtitle">AI-powered SWOT analysis for your competitive landscape</p></div>
        <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Analyze Competitor</button>
      </div>

      {competitors.length > 0 && (
        <div className="brain-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
          {[
            { label: 'Competitors tracked', value: competitors.length },
            { label: 'Avg threat score', value: Math.round(competitors.reduce((s, c) => s + (c.score||0), 0) / competitors.length) },
            { label: 'Highest threat', value: [...competitors].sort((a,b) => (b.score||0)-(a.score||0))[0]?.competitorName || '—' },
          ].map(s => (
            <div key={s.label} className="db-stat-card">
              <div className="db-stat-label">{s.label}</div>
              <div className="db-stat-value" style={{ fontSize: 22 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="brain-toolbar">
        <span style={{ fontSize: 12, color: '#aaa' }}>{competitors.length} {competitors.length === 1 ? 'competitor' : 'competitors'}</span>
        <button className="brain-refresh-btn" onClick={fetch}><RefreshCw size={13} /></button>
      </div>

      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="brain-loading">{[1,2,3].map(i => <div key={i} className="brain-skeleton" style={{ height: 72 }} />)}</div>
      ) : competitors.length === 0 ? (
        <div className="brain-empty">
          <div className="brain-empty-icon"><Target size={32} color="#ccc" /></div>
          <h3 className="brain-empty-title">No competitors analyzed yet</h3>
          <p className="brain-empty-subtitle">Add a competitor and get an instant AI-generated SWOT analysis with a threat score.</p>
          <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Analyze First Competitor</button>
        </div>
      ) : (
        <div className="brain-list">
          {competitors.map(c => <CompetitorCard key={c.id} competitor={c} onDelete={handleDelete} />)}
        </div>
      )}

      {showModal && <CompetitorModal loading={submitting} onClose={() => !submitting && setShowModal(false)} onSubmit={handleCreate} />}
    </>
  );
}
