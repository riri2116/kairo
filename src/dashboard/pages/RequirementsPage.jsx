import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, X, Trash2, Loader2, RefreshCw, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';
import { requirementsApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const PRIORITY_COLOR = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#6366f1', LOW: '#888' };
const STATUS_CONFIG = {
  DRAFT:       { color: '#888',    bg: '#F6F5F2', label: 'Draft'       },
  REVIEW:      { color: '#a855f7', bg: '#FDF4FF', label: 'In Review'   },
  APPROVED:    { color: '#6366f1', bg: '#EEF2FF', label: 'Approved'    },
  IN_PROGRESS: { color: '#f97316', bg: '#FFF7ED', label: 'In Progress' },
  COMPLETED:   { color: '#22c55e', bg: '#F0FDF4', label: 'Completed'   },
  REJECTED:    { color: '#ef4444', bg: '#FFF5F5', label: 'Rejected'    },
};
const TYPE_CONFIG = {
  FEATURE:       { label: 'Feature',       color: '#6366f1' },
  BUG_FIX:       { label: 'Bug Fix',       color: '#ef4444' },
  IMPROVEMENT:   { label: 'Improvement',   color: '#22c55e' },
  TECHNICAL_DEBT:{ label: 'Tech Debt',     color: '#f59e0b' },
  RESEARCH:      { label: 'Research',      color: '#a855f7' },
};

const STATUS_ORDER = ['DRAFT','REVIEW','APPROVED','IN_PROGRESS','COMPLETED','REJECTED'];

function RequirementModal({ initial, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', type: 'FEATURE', priority: 'MEDIUM',
    status: 'DRAFT', acceptanceCriteria: '', tags: '',
  });
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.description.trim()) return setError('Description is required.');
    await onSubmit({
      ...form,
      acceptanceCriteria: form.acceptanceCriteria.split('\n').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
    });
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal" style={{ maxWidth: 580 }}>
        <div className="db-modal-header">
          <h2 className="db-modal-title">{initial ? 'Edit Requirement' : 'New Requirement'}</h2>
          {!loading && <button className="db-modal-close" onClick={onClose}><X size={16} /></button>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            <div className="db-form-group">
              <label className="db-form-label">Title <span className="db-form-required">*</span></label>
              <input className="db-form-input" placeholder="e.g. AI-powered search with semantic matching" value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Description <span className="db-form-required">*</span></label>
              <textarea className="db-form-input" style={{ minHeight: 90, resize: 'vertical' }} placeholder="Describe what needs to be built and why..." value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} rows={4} />
            </div>
            <div className="db-field-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                ['type', 'Type', Object.entries(TYPE_CONFIG).map(([k, v]) => [k, v.label])],
                ['priority', 'Priority', ['CRITICAL','HIGH','MEDIUM','LOW'].map(p => [p, p])],
                ['status', 'Status', Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])],
              ].map(([key, label, opts]) => (
                <div key={key} className="db-form-group">
                  <label className="db-form-label">{label}</label>
                  <select className="db-form-input" value={form[key]} onChange={e => set(key, e.target.value)} disabled={loading}>
                    {opts.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Acceptance Criteria <span className="db-form-hint">— one per line</span></label>
              <textarea className="db-form-input" style={{ minHeight: 70, resize: 'vertical' }} placeholder="User can search by natural language&#10;Results ranked by relevance&#10;Response time < 200ms" value={form.acceptanceCriteria} onChange={e => set('acceptanceCriteria', e.target.value)} disabled={loading} rows={3} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Tags <span className="db-form-hint">— comma separated</span></label>
              <input className="db-form-input" placeholder="ai, search, core, v2" value={form.tags} onChange={e => set('tags', e.target.value)} disabled={loading} />
            </div>
            {error && <div className="db-alert db-alert-error">{error}</div>}
          </div>
          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary" disabled={loading}>{loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Requirement'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReqCard({ req, onDelete, onEdit, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.DRAFT;
  const tc = TYPE_CONFIG[req.type] || TYPE_CONFIG.FEATURE;
  const nextStatus = STATUS_ORDER[(STATUS_ORDER.indexOf(req.status) + 1) % STATUS_ORDER.length];

  async function handleDelete() {
    if (!confirm('Delete this requirement?')) return;
    setDeleting(true);
    await onDelete(req.id);
  }

  return (
    <div className={`brain-card${expanded ? ' expanded' : ''}`}>
      <div className="brain-card-header" onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: '#F6F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={14} color="#888" />
        </div>
        <div className="brain-card-meta">
          <div className="brain-card-title">{req.title}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="brain-tag" style={{ color: tc.color, background: `${tc.color}15` }}>{tc.label}</span>
            <span className="brain-tag" style={{ color: PRIORITY_COLOR[req.priority], background: `${PRIORITY_COLOR[req.priority]}15` }}>{req.priority}</span>
            <span className="brain-tag" style={{ color: sc.color, background: sc.bg, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onStatusChange(req.id, nextStatus); }} title={`Move to ${STATUS_CONFIG[nextStatus]?.label}`}>{sc.label}</span>
            {(req.tags || []).map(t => (
              <span key={t} style={{ fontSize: 11, color: '#aaa', background: '#F6F5F2', padding: '2px 7px', borderRadius: 100 }}>#{t}</span>
            ))}
          </div>
        </div>
        <div className="brain-card-right">
          <div className="brain-card-date">{new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div className="brain-card-actions" onClick={e => e.stopPropagation()}>
            <button className="brain-action-btn" onClick={() => onEdit(req)} title="Edit"><Edit2 size={13} /></button>
            <button className="brain-action-btn danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 size={13} className="brain-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
          <div className="brain-expand-icon">{expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</div>
        </div>
      </div>

      {expanded && (
        <div className="brain-card-body">
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: '0 0 14px' }}>{req.description}</p>
          {(req.acceptanceCriteria || []).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Acceptance Criteria</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {req.acceptanceCriteria.map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#444' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {req.product && <div style={{ fontSize: 12, color: '#aaa' }}>Product: {req.product.name}</div>}
        </div>
      )}
    </div>
  );
}

export default function RequirementsPage() {
  const { workspaceSlug } = useAuth();
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editReq, setEditReq] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    try { const r = await requirementsApi.list(workspaceSlug, { status: filterStatus || undefined }); setReqs(r.data || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [workspaceSlug, filterStatus]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleCreate(data) {
    setSubmitting(true);
    try { const r = await requirementsApi.create(workspaceSlug, data); setReqs(p => [r.data, ...p]); setShowModal(false); }
    catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleEdit(data) {
    setSubmitting(true);
    try {
      const r = await requirementsApi.update(editReq.id, data);
      setReqs(p => p.map(r2 => r2.id === editReq.id ? r.data : r2));
      setEditReq(null);
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    try { await requirementsApi.delete(id); setReqs(p => p.filter(r => r.id !== id)); }
    catch (e) { setError(e.message); }
  }

  async function handleStatusChange(id, status) {
    try {
      const r = await requirementsApi.update(id, { status });
      setReqs(p => p.map(r2 => r2.id === id ? r.data : r2));
    } catch (e) { setError(e.message); }
  }

  const openCount = reqs.filter(r => !['COMPLETED','REJECTED'].includes(r.status)).length;

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Requirements</h1><p className="db-page-subtitle">Track features, improvements, and acceptance criteria</p></div>
        <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> New Requirement</button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {[['', 'All', reqs.length], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label, reqs.filter(r => r.status === k).length])].map(([k, label, count]) => (
          <button key={k} onClick={() => setFilterStatus(k)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.12s', background: filterStatus === k ? '#111' : '#fff', color: filterStatus === k ? '#fff' : '#666', borderColor: filterStatus === k ? '#111' : '#E5E4E0', fontFamily: 'inherit' }}>
            {label}
            <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>{count}</span>
          </button>
        ))}
        <button className="brain-refresh-btn" style={{ marginLeft: 'auto' }} onClick={fetch}><RefreshCw size={13} /></button>
      </div>

      {openCount > 0 && (
        <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>
          {openCount} open {openCount === 1 ? 'requirement' : 'requirements'} — click a status badge to advance it
        </div>
      )}

      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="brain-loading">{[1,2,3,4].map(i => <div key={i} className="brain-skeleton" style={{ height: 64 }} />)}</div>
      ) : reqs.length === 0 ? (
        <div className="brain-empty">
          <div className="brain-empty-icon"><FileText size={32} color="#ccc" /></div>
          <h3 className="brain-empty-title">{filterStatus ? `No ${STATUS_CONFIG[filterStatus]?.label} requirements` : 'No requirements yet'}</h3>
          <p className="brain-empty-subtitle">Document features, bug fixes, and improvements with acceptance criteria and priority levels.</p>
          <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Create First Requirement</button>
        </div>
      ) : (
        <div className="brain-list">
          {reqs.map(r => <ReqCard key={r.id} req={r} onDelete={handleDelete} onEdit={r => { setEditReq({ ...r, acceptanceCriteria: (r.acceptanceCriteria||[]).join('\n'), tags: (r.tags||[]).join(', ') }); }} onStatusChange={handleStatusChange} />)}
        </div>
      )}

      {showModal && <RequirementModal loading={submitting} onClose={() => !submitting && setShowModal(false)} onSubmit={handleCreate} />}
      {editReq && <RequirementModal initial={editReq} loading={submitting} onClose={() => !submitting && setEditReq(null)} onSubmit={handleEdit} />}
    </>
  );
}
