import React, { useState, useEffect, useCallback } from 'react';
import { FlaskConical, Plus, X, Trash2, Loader2, RefreshCw, ChevronDown, ChevronRight, ArrowUp, Clock, CheckCircle } from 'lucide-react';
import { sandboxApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const RISK_CONFIG = {
  LOW:    { color: '#22c55e', bg: '#22c55e15', label: 'Low Risk'    },
  MEDIUM: { color: '#f59e0b', bg: '#f59e0b15', label: 'Medium Risk' },
  HIGH:   { color: '#ef4444', bg: '#ef444415', label: 'High Risk'   },
};

function SandboxModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ featureName: '', description: '' });
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.featureName.trim()) return setError('Feature name is required.');
    await onSubmit(form);
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal" style={{ maxWidth: 500 }}>
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={18} color="#a855f7" />
            </div>
            <div>
              <h2 className="db-modal-title">Simulate Feature</h2>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>AI predicts impact before you build</p>
            </div>
          </div>
          {!loading && <button className="db-modal-close" onClick={onClose}><X size={16} /></button>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            <div className="db-form-group">
              <label className="db-form-label">Feature name <span className="db-form-required">*</span></label>
              <input className="db-form-input" placeholder="e.g. AI-powered search, Dark mode, Offline sync" value={form.featureName} onChange={e => set('featureName', e.target.value)} maxLength={150} disabled={loading} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Description <span className="db-form-hint">— more detail = better predictions</span></label>
              <textarea className="db-form-input" style={{ minHeight: 100, resize: 'vertical' }} placeholder="Describe what the feature does, the user problem it solves, how it fits into the existing product, and any relevant technical constraints..." value={form.description} onChange={e => set('description', e.target.value)} maxLength={2000} disabled={loading} rows={4} />
            </div>
            {error && <div className="db-alert db-alert-error">{error}</div>}
            {loading && (
              <div className="brain-running-state">
                <Loader2 size={20} className="brain-spin" color="#a855f7" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Running simulation…</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Modeling retention, revenue, and engagement impact</div>
                </div>
              </div>
            )}
          </div>
          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {loading ? <><Loader2 size={14} className="brain-spin" /> Simulating…</> : <><FlaskConical size={14} /> Run Simulation</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImpactBar({ label, value, color }) {
  return (
    <div style={{ flex: 1, minWidth: 80 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
        <span style={{ fontSize: 16, fontFamily: 'Instrument Serif, serif', color: color || '#22c55e', fontWeight: 600 }}>+{value}%</span>
      </div>
      <div style={{ height: 3, background: '#F0EFEC', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(value * 2, 100)}%`, background: color || '#22c55e', borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>{label}</div>
    </div>
  );
}

function SandboxCard({ sandbox, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const rc = RISK_CONFIG[sandbox.riskLevel] || RISK_CONFIG.MEDIUM;
  const params = sandbox.parameters || {};
  const results = sandbox.results || {};

  async function handleDelete() {
    if (!confirm(`Delete "${sandbox.featureName}"?`)) return;
    setDeleting(true);
    await onDelete(sandbox.id);
  }

  return (
    <div className={`brain-card${expanded ? ' expanded' : ''}`}>
      <div className="brain-card-header" onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FlaskConical size={15} color="#a855f7" />
        </div>
        <div className="brain-card-meta">
          <div className="brain-card-title">{sandbox.featureName}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="brain-tag" style={{ color: rc.color, background: rc.bg }}>{rc.label}</span>
            {sandbox.effortEstimateDays && (
              <span style={{ fontSize: 11.5, color: '#888', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{sandbox.effortEstimateDays}d est.</span>
            )}
          </div>
        </div>
        <div className="brain-card-right">
          <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            {[['Retention', sandbox.retentionImpact, '#22c55e'], ['Revenue', sandbox.revenueImpact, '#6366f1'], ['Engagement', sandbox.engagementImpact, '#f97316']].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontFamily: 'Instrument Serif, serif', color: c, lineHeight: 1 }}>+{v}%</div>
                <div style={{ fontSize: 10, color: '#bbb', marginTop: 1 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="brain-card-date">{new Date(sandbox.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #ECEAE7', borderRadius: 10, padding: '14px 15px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Impact Projection</div>
              <div style={{ display: 'flex', gap: 14 }}>
                <ImpactBar label="Retention" value={sandbox.retentionImpact} color="#22c55e" />
                <ImpactBar label="Revenue" value={sandbox.revenueImpact} color="#6366f1" />
                <ImpactBar label="Engagement" value={sandbox.engagementImpact} color="#f97316" />
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #ECEAE7', borderRadius: 10, padding: '14px 15px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Model Output</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Projected DAU', results.projectedDAU],
                  ['Projected MRR', results.projectedMRR],
                  ['Break-even', `${results.breakEvenWeeks}w`],
                  ['Success probability', `${results.successProbability}%`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {params.targetSegment && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
              {[
                ['Target segment', params.targetSegment],
                ['Adoption rate', `${params.adoptionRate}%`],
                ['Time to value', params.timeToValue],
                ['Confidence interval', params.confidenceInterval],
              ].map(([l, v]) => (
                <div key={l} style={{ background: '#F6F5F2', borderRadius: 7, padding: '5px 10px' }}>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{l}: </span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#555' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {sandbox.description && (
            <div style={{ background: '#111', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7 }}>AI Summary</div>
              <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.6, margin: 0 }}>{sandbox.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FeatureSandboxPage() {
  const { workspaceSlug } = useAuth();
  const [sandboxes, setSandboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    try { const r = await sandboxApi.list(workspaceSlug); setSandboxes(r.data || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [workspaceSlug]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleCreate(data) {
    setSubmitting(true);
    try { const r = await sandboxApi.create(workspaceSlug, data); setSandboxes(p => [r.data, ...p]); setShowModal(false); }
    catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    try { await sandboxApi.delete(id); setSandboxes(p => p.filter(s => s.id !== id)); }
    catch (e) { setError(e.message); }
  }

  const avgRetention = sandboxes.length ? Math.round(sandboxes.reduce((s, b) => s + (b.retentionImpact||0), 0) / sandboxes.length) : null;

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Feature Sandbox</h1><p className="db-page-subtitle">Simulate feature impact on retention, revenue, and engagement before you build</p></div>
        <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Simulate Feature</button>
      </div>

      {sandboxes.length > 0 && (
        <div className="brain-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
          {[
            { label: 'Features simulated', value: sandboxes.length },
            { label: 'Avg retention impact', value: avgRetention != null ? `+${avgRetention}%` : '—' },
            { label: 'Low risk features', value: sandboxes.filter(s => s.riskLevel === 'LOW').length },
          ].map(s => (
            <div key={s.label} className="db-stat-card">
              <div className="db-stat-label">{s.label}</div>
              <div className="db-stat-value" style={{ fontSize: 22 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="brain-toolbar">
        <span style={{ fontSize: 12, color: '#aaa' }}>{sandboxes.length} {sandboxes.length === 1 ? 'simulation' : 'simulations'}</span>
        <button className="brain-refresh-btn" onClick={fetch}><RefreshCw size={13} /></button>
      </div>

      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="brain-loading">{[1,2,3].map(i => <div key={i} className="brain-skeleton" style={{ height: 72 }} />)}</div>
      ) : sandboxes.length === 0 ? (
        <div className="brain-empty">
          <div className="brain-empty-icon"><FlaskConical size={32} color="#ccc" /></div>
          <h3 className="brain-empty-title">No simulations yet</h3>
          <p className="brain-empty-subtitle">Run a simulation to predict how a feature will affect retention, revenue, and engagement before committing engineering resources.</p>
          <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Run First Simulation</button>
        </div>
      ) : (
        <div className="brain-list">
          {sandboxes.map(s => <SandboxCard key={s.id} sandbox={s} onDelete={handleDelete} />)}
        </div>
      )}

      {showModal && <SandboxModal loading={submitting} onClose={() => !submitting && setShowModal(false)} onSubmit={handleCreate} />}
    </>
  );
}
