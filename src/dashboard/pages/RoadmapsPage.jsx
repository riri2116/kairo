import React, { useState, useEffect, useCallback } from 'react';
import { Map, Plus, X, Trash2, Loader2, RefreshCw, ChevronDown, ChevronRight, CheckCircle, Circle, Clock, AlertCircle, Edit2, Check } from 'lucide-react';
import { roadmapsApi } from '../lib/api';
import { useAuth } from '../lib/auth';

const STATUS_CONFIG = {
  DRAFT:     { label: 'Draft',       color: '#888',    bg: '#F6F5F2' },
  ACTIVE:    { label: 'Active',      color: '#22c55e', bg: '#F0FDF4' },
  COMPLETED: { label: 'Completed',   color: '#6366f1', bg: '#EEF2FF' },
  ARCHIVED:  { label: 'Archived',    color: '#aaa',    bg: '#F6F5F2' },
};

const ITEM_STATUS = {
  PLANNED:     { icon: Circle,       color: '#bbb',    label: 'Planned'     },
  IN_PROGRESS: { icon: Clock,        color: '#6366f1', label: 'In Progress' },
  COMPLETED:   { icon: CheckCircle,  color: '#22c55e', label: 'Completed'   },
  BLOCKED:     { icon: AlertCircle,  color: '#ef4444', label: 'Blocked'     },
};

const PRIORITY_COLOR = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#6366f1', LOW: '#888' };

function RoadmapModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ title: '', description: '', quarter: '', status: 'DRAFT', goals: '' });
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    await onSubmit({ ...form, goals: form.goals.split('\n').map(g => g.trim()).filter(Boolean) });
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal" style={{ maxWidth: 520 }}>
        <div className="db-modal-header">
          <h2 className="db-modal-title">New Roadmap</h2>
          {!loading && <button className="db-modal-close" onClick={onClose}><X size={16} /></button>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            <div className="db-field-row">
              <div className="db-form-group">
                <label className="db-form-label">Title <span className="db-form-required">*</span></label>
                <input className="db-form-input" placeholder="e.g. Q3 2025 — AI Expansion" value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Quarter</label>
                <input className="db-form-input" placeholder="e.g. Q3 2025" value={form.quarter} onChange={e => set('quarter', e.target.value)} disabled={loading} />
              </div>
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Description</label>
              <textarea className="db-form-input" style={{ minHeight: 70, resize: 'vertical' }} placeholder="What this roadmap covers..." value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} rows={3} />
            </div>
            <div className="db-field-row">
              <div className="db-form-group">
                <label className="db-form-label">Status</label>
                <select className="db-form-input" value={form.status} onChange={e => set('status', e.target.value)} disabled={loading}>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Goals <span className="db-form-hint">— one per line</span></label>
              <textarea className="db-form-input" style={{ minHeight: 70, resize: 'vertical' }} placeholder="Reach 10k MAU&#10;Launch AI features&#10;Improve D30 retention to 55%" value={form.goals} onChange={e => set('goals', e.target.value)} disabled={loading} rows={3} />
            </div>
            {error && <div className="db-alert db-alert-error">{error}</div>}
          </div>
          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create Roadmap'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddItemForm({ roadmapId, onAdd, onCancel }) {
  const [form, setForm] = useState({ title: '', priority: 'MEDIUM', status: 'PLANNED' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try { await onAdd(form); setForm({ title: '', priority: 'MEDIUM', status: 'PLANNED' }); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, padding: '10px 0', borderTop: '1px solid #F6F5F2', flexWrap: 'wrap' }}>
      <input className="db-form-input" style={{ flex: 1, minWidth: 180, padding: '7px 10px', fontSize: 13 }} placeholder="New item title…" value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} autoFocus />
      <select className="db-form-input" style={{ width: 110, padding: '7px 10px', fontSize: 12 }} value={form.priority} onChange={e => set('priority', e.target.value)} disabled={loading}>
        {['CRITICAL','HIGH','MEDIUM','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select className="db-form-input" style={{ width: 120, padding: '7px 10px', fontSize: 12 }} value={form.status} onChange={e => set('status', e.target.value)} disabled={loading}>
        {Object.entries(ITEM_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <button type="submit" className="db-btn db-btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} disabled={loading || !form.title.trim()}>
        {loading ? <Loader2 size={13} className="brain-spin" /> : <Check size={13} />}
      </button>
      <button type="button" className="db-btn db-btn-ghost" style={{ padding: '7px 10px', fontSize: 12 }} onClick={onCancel}><X size={13} /></button>
    </form>
  );
}

function RoadmapCard({ roadmap, onDelete, onAddItem, onDeleteItem, onUpdateItem }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const sc = STATUS_CONFIG[roadmap.status] || STATUS_CONFIG.DRAFT;
  const items = roadmap.items || [];

  async function handleDelete() {
    if (!confirm(`Delete "${roadmap.title}"?`)) return;
    setDeleting(true);
    await onDelete(roadmap.id);
  }

  return (
    <div className={`brain-card${expanded ? ' expanded' : ''}`}>
      <div className="brain-card-header" onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Map size={15} color="#22c55e" />
        </div>
        <div className="brain-card-meta">
          <div className="brain-card-title">{roadmap.title}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="brain-tag" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
            {roadmap.quarter && <span style={{ fontSize: 11.5, color: '#aaa' }}>{roadmap.quarter}</span>}
            <span style={{ fontSize: 11.5, color: '#aaa' }}>{items.length} items</span>
          </div>
        </div>
        <div className="brain-card-right">
          {items.length > 0 && (
            <div style={{ width: 80, flexShrink: 0 }}>
              <div style={{ height: 4, background: '#F0EFEC', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round(items.filter(i => i.status === 'COMPLETED').length / items.length * 100)}%`, background: '#22c55e', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: '#bbb', marginTop: 3, textAlign: 'right' }}>
                {items.filter(i => i.status === 'COMPLETED').length}/{items.length} done
              </div>
            </div>
          )}
          <div className="brain-card-date">{new Date(roadmap.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
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
          {roadmap.description && <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: '0 0 14px' }}>{roadmap.description}</p>}
          {roadmap.goals?.length > 0 && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
              {roadmap.goals.map((g, i) => (
                <span key={i} style={{ fontSize: 11.5, background: '#EEF2FF', color: '#6366f1', padding: '3px 10px', borderRadius: 100, fontWeight: 500 }}>◎ {g}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {items.map((item, i) => {
              const is = ITEM_STATUS[item.status] || ITEM_STATUS.PLANNED;
              const Icon = is.icon;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < items.length - 1 ? '1px solid #F6F5F2' : 'none' }}>
                  <button onClick={() => { const statuses = ['PLANNED','IN_PROGRESS','COMPLETED']; const next = statuses[(statuses.indexOf(item.status) + 1) % statuses.length]; onUpdateItem(roadmap.id, item.id, { status: next }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} title="Cycle status">
                    <Icon size={15} color={is.color} />
                  </button>
                  <div style={{ flex: 1, fontSize: 13, color: item.status === 'COMPLETED' ? '#aaa' : '#111', textDecoration: item.status === 'COMPLETED' ? 'line-through' : 'none' }}>{item.title}</div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: PRIORITY_COLOR[item.priority], background: `${PRIORITY_COLOR[item.priority]}15`, padding: '2px 7px', borderRadius: 100, flexShrink: 0 }}>{item.priority}</span>
                  <button onClick={() => onDeleteItem(roadmap.id, item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', padding: '2px', borderRadius: 4, display: 'flex', alignItems: 'center' }} className="brain-action-btn" title="Remove">
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
          {showAddItem ? (
            <AddItemForm roadmapId={roadmap.id} onAdd={data => onAddItem(roadmap.id, data, () => setShowAddItem(false))} onCancel={() => setShowAddItem(false)} />
          ) : (
            <button className="db-btn db-btn-ghost" style={{ marginTop: 10, width: '100%', justifyContent: 'center', gap: 6 }} onClick={() => setShowAddItem(true)}>
              <Plus size={13} /> Add item
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoadmapsPage() {
  const { workspaceSlug } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    try { const r = await roadmapsApi.list(workspaceSlug); setRoadmaps(r.data || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [workspaceSlug]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleCreate(data) {
    setSubmitting(true);
    try { const r = await roadmapsApi.create(workspaceSlug, data); setRoadmaps(p => [r.data, ...p]); setShowModal(false); }
    catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    try { await roadmapsApi.delete(id); setRoadmaps(p => p.filter(r => r.id !== id)); }
    catch (e) { setError(e.message); }
  }

  async function handleAddItem(roadmapId, data, onDone) {
    try {
      const r = await roadmapsApi.addItem(roadmapId, data);
      setRoadmaps(prev => prev.map(rm => rm.id === roadmapId ? { ...rm, items: [...(rm.items||[]), r.data] } : rm));
      onDone?.();
    } catch (e) { setError(e.message); }
  }

  async function handleDeleteItem(roadmapId, itemId) {
    try {
      await roadmapsApi.deleteItem(roadmapId, itemId);
      setRoadmaps(prev => prev.map(rm => rm.id === roadmapId ? { ...rm, items: (rm.items||[]).filter(i => i.id !== itemId) } : rm));
    } catch (e) { setError(e.message); }
  }

  async function handleUpdateItem(roadmapId, itemId, data) {
    try {
      const r = await roadmapsApi.updateItem(roadmapId, itemId, data);
      setRoadmaps(prev => prev.map(rm => rm.id === roadmapId ? { ...rm, items: (rm.items||[]).map(i => i.id === itemId ? r.data : i) } : rm));
    } catch (e) { setError(e.message); }
  }

  return (
    <>
      <div className="db-page-header">
        <div><h1 className="db-page-title">Roadmaps</h1><p className="db-page-subtitle">Plan and track your product roadmaps by quarter</p></div>
        <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> New Roadmap</button>
      </div>

      <div className="brain-toolbar">
        <span style={{ fontSize: 12, color: '#aaa' }}>{roadmaps.length} {roadmaps.length === 1 ? 'roadmap' : 'roadmaps'}</span>
        <button className="brain-refresh-btn" onClick={fetch}><RefreshCw size={13} /></button>
      </div>

      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="brain-loading">{[1,2].map(i => <div key={i} className="brain-skeleton" style={{ height: 72 }} />)}</div>
      ) : roadmaps.length === 0 ? (
        <div className="brain-empty">
          <div className="brain-empty-icon"><Map size={32} color="#ccc" /></div>
          <h3 className="brain-empty-title">No roadmaps yet</h3>
          <p className="brain-empty-subtitle">Create a roadmap to plan your product quarter, set goals, and track items from planned to shipped.</p>
          <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Create First Roadmap</button>
        </div>
      ) : (
        <div className="brain-list">
          {roadmaps.map(r => (
            <RoadmapCard key={r.id} roadmap={r} onDelete={handleDelete}
              onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onUpdateItem={handleUpdateItem} />
          ))}
        </div>
      )}

      {showModal && <RoadmapModal loading={submitting} onClose={() => !submitting && setShowModal(false)} onSubmit={handleCreate} />}
    </>
  );
}
