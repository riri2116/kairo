import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Plus, X, Trash2, Loader2, RefreshCw, ChevronDown, ChevronRight,
  Play, Download, GripVertical, ArrowUp, ArrowDown, AlertTriangle, Lightbulb,
  GitCompareArrows, Gauge, TrendingDown, ShieldCheck, Sparkles, Target,
  Clock, CheckCircle2, XCircle, History, Pencil,
} from 'lucide-react';
import { emotionApi } from '../lib/api';
import { useAuth } from '../lib/auth';

// ─── Config ─────────────────────────────────────────────────────────────────

const JOURNEY_TYPES = [
  { value: 'ONBOARDING',          label: 'User Onboarding'     },
  { value: 'CHECKOUT',            label: 'Checkout Flow'       },
  { value: 'FEATURE_DISCOVERY',   label: 'Feature Discovery'   },
  { value: 'SUBSCRIPTION_UPGRADE',label: 'Subscription Upgrade'},
  { value: 'PRODUCT_ACTIVATION',  label: 'Product Activation'  },
  { value: 'CUSTOM',              label: 'Custom Journey'      },
];

const EMOTION_CONFIG = {
  EXCITED:     { color: '#f59e0b', label: 'Excited'     },
  CURIOUS:     { color: '#0ea5e9', label: 'Curious'     },
  CONFIDENT:   { color: '#22c55e', label: 'Confident'   },
  CONFUSED:    { color: '#a855f7', label: 'Confused'    },
  FRUSTRATED:  { color: '#ef4444', label: 'Frustrated'  },
  OVERWHELMED: { color: '#f97316', label: 'Overwhelmed' },
  DELIGHTED:   { color: '#ec4899', label: 'Delighted'   },
};

const RISK_CONFIG = {
  LOW:      { color: '#22c55e', label: 'Low'      },
  MEDIUM:   { color: '#f59e0b', label: 'Medium'   },
  HIGH:     { color: '#ef4444', label: 'High'     },
  CRITICAL: { color: '#b91c1c', label: 'Critical' },
};

const CATEGORY_CONFIG = {
  SIMPLIFICATION:   { label: 'Simplification',  color: '#0ea5e9' },
  ONBOARDING:       { label: 'Onboarding',      color: '#8b5cf6' },
  GUIDANCE:         { label: 'Guidance',        color: '#22c55e' },
  FLOW_IMPROVEMENT: { label: 'Flow Improvement',color: '#f59e0b' },
};

const STATUS_CONFIG = {
  PENDING:   { icon: Clock,        color: '#94a3b8', label: 'Pending'   },
  RUNNING:   { icon: Loader2,      color: '#6366f1', label: 'Analyzing' },
  COMPLETED: { icon: CheckCircle2, color: '#22c55e', label: 'Completed' },
  FAILED:    { icon: XCircle,      color: '#ef4444', label: 'Failed'    },
};

const METRIC_META = [
  { key: 'avgFrictionScore',    label: 'Avg Friction',          icon: Gauge,       invert: true  },
  { key: 'dropOffRisk',         label: 'Drop-off Risk',         icon: TrendingDown,invert: true  },
  { key: 'confidenceScore',     label: 'Confidence',            icon: ShieldCheck, invert: false },
  { key: 'delightScore',        label: 'Delight',               icon: Sparkles,    invert: false },
  { key: 'activationPotential', label: 'Activation Potential',  icon: Target,      invert: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeLabel(v) { return JOURNEY_TYPES.find(t => t.value === v)?.label || 'Custom Journey'; }
function emotion(v)   { return EMOTION_CONFIG[v] || EMOTION_CONFIG.CURIOUS; }

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function scoreColor(v, invert) {
  if (v == null) return 'var(--text-tertiary)';
  const good = invert ? v <= 33 : v >= 67;
  const bad  = invert ? v >= 67 : v <= 33;
  return good ? '#22c55e' : bad ? '#ef4444' : '#f59e0b';
}

// friction/risk magnitude → red intensity (always: higher = worse)
function heatColor(v) {
  if (v == null) return 'var(--surface-2)';
  if (v <= 33) return '#22c55e';
  if (v <= 66) return '#f59e0b';
  return '#ef4444';
}

function latestCompleted(journey) {
  return (journey.analyses || []).find(a => a.status === 'COMPLETED') || null;
}

function exportReport(journey, analysis) {
  const m = analysis;
  const L = [];
  L.push(`KAIRO — EMOTION SIMULATOR REPORT`);
  L.push('='.repeat(54), '');
  L.push(`Journey:   ${journey.name}`);
  L.push(`Type:      ${typeLabel(journey.type)}`);
  L.push(`Analyzed:  ${formatDateTime(analysis.createdAt)}`);
  L.push(`Overall risk: ${RISK_CONFIG[analysis.overallRisk]?.label || '—'}`, '');
  if (analysis.summary) { L.push('SUMMARY', '-'.repeat(7), analysis.summary, ''); }

  L.push('DASHBOARD METRICS', '-'.repeat(16));
  METRIC_META.forEach(mt => L.push(`${mt.label.padEnd(22)} ${m[mt.key] ?? '—'}${m[mt.key] != null ? '/100' : ''}`));
  L.push('');

  L.push('EMOTION TIMELINE', '-'.repeat(16));
  (analysis.timeline || []).forEach(t => {
    L.push(`${t.order}. ${t.title}`);
    L.push(`   Emotion: ${emotion(t.expectedEmotion).label} | Confidence ${t.confidenceScore} | Friction ${t.frictionLevel} | Drop-off ${t.dropOffRisk}`);
    if (t.reasoning) L.push(`   ${t.reasoning}`);
  });
  L.push('');

  if ((analysis.risks || []).length) {
    L.push('UX RISK REPORT', '-'.repeat(14));
    analysis.risks.forEach(r => {
      L.push(`[${RISK_CONFIG[r.level]?.label || r.level}] ${r.area}${r.stepReference ? ` (${r.stepReference})` : ''}`);
      L.push(`   ${r.description}`);
    });
    L.push('');
  }

  if ((analysis.suggestions || []).length) {
    L.push('OPPORTUNITIES', '-'.repeat(13));
    analysis.suggestions.forEach(s => {
      L.push(`[${CATEGORY_CONFIG[s.category]?.label || s.category}] ${s.title}`);
      L.push(`   ${s.description}`);
      if (s.expectedImpact) L.push(`   Expected impact: ${s.expectedImpact}`);
    });
    L.push('');
  }

  const opt = analysis.optimizedJourney;
  if (opt) {
    L.push('OPTIMIZED JOURNEY', '-'.repeat(17));
    if (opt.summary) L.push(opt.summary, '');
    (opt.steps || []).forEach(s => {
      L.push(`${s.order}. ${s.title} — ${emotion(s.expectedEmotion).label} (Friction ${s.frictionLevel}, Drop-off ${s.dropOffRisk})`);
      if (s.change) L.push(`   Change: ${s.change}`);
    });
  }

  const blob = new Blob([L.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emotion-${journey.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Journey Builder Modal ─────────────────────────────────────────────────────

function JourneyModal({ initial, onClose, onSubmit, loading }) {
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState(initial?.type || 'ONBOARDING');
  const [description, setDescription] = useState(initial?.description || '');
  const [steps, setSteps] = useState(
    initial?.steps?.length
      ? initial.steps.map(s => ({ title: s.title, description: s.description || '' }))
      : [{ title: '', description: '' }]
  );
  const [error, setError] = useState('');

  const setStep = (i, k, v) => setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const addStep = () => setSteps(prev => [...prev, { title: '', description: '' }]);
  const removeStep = (i) => setSteps(prev => prev.filter((_, idx) => idx !== i));
  const moveStep = (i, dir) => setSteps(prev => {
    const j = i + dir;
    if (j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError('Journey name is required.');
    const clean = steps.map(s => ({ title: s.title.trim(), description: s.description.trim() })).filter(s => s.title);
    if (clean.length === 0) return setError('Add at least one step with a title.');
    await onSubmit({ name: name.trim(), type, description: description.trim() || null, steps: clean });
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal emo-modal">
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="emo-modal-icon"><Activity size={18} color="#fff" /></div>
            <div>
              <h2 className="db-modal-title">{initial ? 'Edit Journey' : 'New Journey'}</h2>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>Map the steps a user takes — Kairo analyzes the emotional experience</p>
            </div>
          </div>
          {!loading && <button className="db-modal-close" onClick={onClose}><X size={16} /></button>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            <div className="db-form-group">
              <label className="db-form-label">Journey Name <span className="db-form-required">*</span></label>
              <input className="db-form-input" placeholder="e.g. New user onboarding" value={name} onChange={e => { setName(e.target.value); setError(''); }} maxLength={200} disabled={loading} />
            </div>

            <div className="db-form-group">
              <label className="db-form-label">Journey Type</label>
              <div className="emo-type-grid">
                {JOURNEY_TYPES.map(t => (
                  <button key={t.value} type="button"
                    className={`emo-type-btn${type === t.value ? ' active' : ''}`}
                    onClick={() => setType(t.value)} disabled={loading}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="db-form-group">
              <label className="db-form-label">Context <span className="db-form-hint"> — optional, improves analysis</span></label>
              <textarea className="db-form-input" style={{ minHeight: 64, resize: 'vertical' }} placeholder="Who is the user, what is the goal, any constraints…" value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} disabled={loading} rows={2} />
            </div>

            <div className="db-form-group">
              <label className="db-form-label">Journey Steps <span className="db-form-required">*</span><span className="db-form-hint"> — in order</span></label>
              <div className="emo-steps-builder">
                {steps.map((s, i) => (
                  <div key={i} className="emo-step-row">
                    <div className="emo-step-index"><GripVertical size={13} /> {i + 1}</div>
                    <div className="emo-step-fields">
                      <input className="db-form-input" placeholder={`Step ${i + 1} title — e.g. Enter email`} value={s.title} onChange={e => setStep(i, 'title', e.target.value)} maxLength={200} disabled={loading} />
                      <input className="db-form-input emo-step-desc" placeholder="What happens here (optional)" value={s.description} onChange={e => setStep(i, 'description', e.target.value)} maxLength={2000} disabled={loading} />
                    </div>
                    <div className="emo-step-controls">
                      <button type="button" onClick={() => moveStep(i, -1)} disabled={loading || i === 0} title="Move up"><ArrowUp size={13} /></button>
                      <button type="button" onClick={() => moveStep(i, 1)} disabled={loading || i === steps.length - 1} title="Move down"><ArrowDown size={13} /></button>
                      <button type="button" className="danger" onClick={() => removeStep(i)} disabled={loading || steps.length === 1} title="Remove"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="emo-add-step" onClick={addStep} disabled={loading}><Plus size={13} /> Add step</button>
            </div>

            {error && <div className="db-alert db-alert-error">{error}</div>}
          </div>

          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {loading ? <><Loader2 size={14} className="emo-spin" /> Saving…</> : <>{initial ? 'Save Changes' : 'Create Journey'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Emotion Timeline ──────────────────────────────────────────────────────────

function EmotionTimeline({ timeline }) {
  if (!timeline?.length) return null;
  return (
    <div className="emo-block">
      <div className="emo-block-title"><Activity size={14} /> Emotion Timeline</div>
      <div className="emo-timeline">
        {timeline.map((t, i) => {
          const e = emotion(t.expectedEmotion);
          return (
            <div key={i} className="emo-tl-node">
              {i < timeline.length - 1 && <div className="emo-tl-connector" />}
              <div className="emo-tl-dot" style={{ background: e.color }}>{t.order}</div>
              <div className="emo-tl-card">
                <div className="emo-tl-emotion" style={{ color: e.color, background: `${e.color}18` }}>{e.label}</div>
                <div className="emo-tl-step">{t.title}</div>
                <div className="emo-tl-stats">
                  <MiniBar label="Confidence" value={t.confidenceScore} color={scoreColor(t.confidenceScore, false)} />
                  <MiniBar label="Friction"   value={t.frictionLevel}   color={heatColor(t.frictionLevel)} />
                  <MiniBar label="Drop-off"   value={t.dropOffRisk}     color={heatColor(t.dropOffRisk)} />
                </div>
                {t.reasoning && <div className="emo-tl-reason">{t.reasoning}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniBar({ label, value, color }) {
  return (
    <div className="emo-minibar">
      <div className="emo-minibar-head"><span>{label}</span><span style={{ color }}>{value}</span></div>
      <div className="emo-minibar-track"><div className="emo-minibar-fill" style={{ width: `${value}%`, background: color }} /></div>
    </div>
  );
}

// ─── Friction Heatmap ──────────────────────────────────────────────────────────

function FrictionHeatmap({ timeline }) {
  if (!timeline?.length) return null;
  const rows = [
    { key: 'frictionLevel', label: 'Friction'  },
    { key: 'dropOffRisk',   label: 'Drop-off'  },
  ];
  return (
    <div className="emo-block">
      <div className="emo-block-title"><Gauge size={14} /> Friction Heatmap</div>
      <div className="emo-heatmap">
        <div className="emo-heat-row emo-heat-head">
          <div className="emo-heat-rowlabel" />
          {timeline.map((t, i) => <div key={i} className="emo-heat-colhead" title={t.title}>{t.order}</div>)}
        </div>
        {rows.map(row => (
          <div key={row.key} className="emo-heat-row">
            <div className="emo-heat-rowlabel">{row.label}</div>
            {timeline.map((t, i) => {
              const v = t[row.key];
              return (
                <div key={i} className="emo-heat-cell" style={{ background: heatColor(v), opacity: 0.35 + (v / 100) * 0.65 }} title={`${t.title}: ${v}`}>
                  <span>{v}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UX Risk Report ────────────────────────────────────────────────────────────

function RiskReport({ risks }) {
  if (!risks?.length) return null;
  const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const sorted = [...risks].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
  return (
    <div className="emo-block">
      <div className="emo-block-title"><AlertTriangle size={14} /> UX Risk Report</div>
      <div className="emo-risk-list">
        {sorted.map((r, i) => {
          const c = RISK_CONFIG[r.level] || RISK_CONFIG.MEDIUM;
          return (
            <div key={i} className="emo-risk-item" style={{ borderLeftColor: c.color }}>
              <div className="emo-risk-head">
                <span className="emo-risk-badge" style={{ color: c.color, background: `${c.color}18` }}>{c.label} Risk</span>
                <span className="emo-risk-area">{r.area}</span>
                {r.stepReference && <span className="emo-risk-step">{r.stepReference}</span>}
              </div>
              <p className="emo-risk-desc">{r.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Opportunities ──────────────────────────────────────────────────────────────

function Opportunities({ suggestions }) {
  if (!suggestions?.length) return null;
  return (
    <div className="emo-block">
      <div className="emo-block-title"><Lightbulb size={14} /> Opportunities</div>
      <div className="emo-opp-grid">
        {suggestions.map((s, i) => {
          const c = CATEGORY_CONFIG[s.category] || CATEGORY_CONFIG.FLOW_IMPROVEMENT;
          const p = RISK_CONFIG[s.priority] || RISK_CONFIG.MEDIUM;
          return (
            <div key={i} className="emo-opp-card">
              <div className="emo-opp-head">
                <span className="emo-opp-cat" style={{ color: c.color, background: `${c.color}18` }}>{c.label}</span>
                <span className="emo-opp-pri" style={{ color: p.color }}>{p.label} priority</span>
              </div>
              <div className="emo-opp-title">{s.title}</div>
              <p className="emo-opp-desc">{s.description}</p>
              {s.expectedImpact && <div className="emo-opp-impact"><TrendingDown size={11} /> {s.expectedImpact}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Current vs Optimized ────────────────────────────────────────────────────────

function Comparison({ analysis }) {
  const opt = analysis.optimizedJourney;
  if (!opt?.metrics) return null;
  const cur = {
    avgFrictionScore: analysis.avgFrictionScore,
    dropOffRisk: analysis.dropOffRisk,
    confidenceScore: analysis.confidenceScore,
    delightScore: analysis.delightScore,
    activationPotential: analysis.activationPotential,
  };
  return (
    <div className="emo-block">
      <div className="emo-block-title"><GitCompareArrows size={14} /> Current vs Optimized</div>
      {opt.summary && <p className="emo-compare-summary">{opt.summary}</p>}
      <div className="emo-compare-grid">
        {METRIC_META.map(mt => {
          const a = cur[mt.key];
          const b = opt.metrics[mt.key];
          if (a == null || b == null) return null;
          const delta = b - a;
          const improved = mt.invert ? delta < 0 : delta > 0;
          return (
            <div key={mt.key} className="emo-compare-row">
              <div className="emo-compare-label">{mt.label}</div>
              <div className="emo-compare-bars">
                <div className="emo-cmp-bar">
                  <div className="emo-cmp-fill cur" style={{ width: `${a}%` }} />
                  <span>{a}</span>
                </div>
                <div className="emo-cmp-bar">
                  <div className="emo-cmp-fill opt" style={{ width: `${b}%` }} />
                  <span>{b}</span>
                </div>
              </div>
              <div className="emo-compare-delta" style={{ color: delta === 0 ? 'var(--text-tertiary)' : improved ? '#22c55e' : '#ef4444' }}>
                {delta > 0 ? '+' : ''}{delta}
              </div>
            </div>
          );
        })}
      </div>
      <div className="emo-compare-legend">
        <span><i className="cur" /> Current</span>
        <span><i className="opt" /> Optimized</span>
      </div>
      {(opt.steps || []).length > 0 && (
        <div className="emo-opt-steps">
          {opt.steps.map((s, i) => (
            <div key={i} className="emo-opt-step">
              <span className="emo-opt-num">{s.order}</span>
              <div>
                <div className="emo-opt-title">{s.title} <span className="emo-opt-emotion" style={{ color: emotion(s.expectedEmotion).color }}>{emotion(s.expectedEmotion).label}</span></div>
                {s.change && <div className="emo-opt-change">{s.change}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Analysis View ──────────────────────────────────────────────────────────────

function AnalysisView({ journey, analysis, onExport }) {
  return (
    <div className="emo-analysis">
      <div className="emo-analysis-top">
        <div className="emo-metrics-strip">
          {METRIC_META.map(mt => {
            const v = analysis[mt.key];
            return (
              <div key={mt.key} className="emo-metric-pill">
                <div className="emo-metric-val" style={{ color: scoreColor(v, mt.invert) }}>{v ?? '—'}</div>
                <div className="emo-metric-lbl">{mt.label}</div>
              </div>
            );
          })}
        </div>
        <button className="db-btn db-btn-ghost emo-export" onClick={() => onExport(journey, analysis)}><Download size={13} /> Export</button>
      </div>
      {analysis.summary && <p className="emo-summary">{analysis.summary}</p>}
      <EmotionTimeline timeline={analysis.timeline} />
      <FrictionHeatmap timeline={analysis.timeline} />
      <div className="emo-two-col">
        <RiskReport risks={analysis.risks} />
        <Opportunities suggestions={analysis.suggestions} />
      </div>
      <Comparison analysis={analysis} />
    </div>
  );
}

// ─── Journey Card ────────────────────────────────────────────────────────────────

function JourneyCard({ journey, onAnalyze, onEdit, onDelete, onDeleteAnalysis, onExport, onExpand, analyzing }) {
  const [expanded, setExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  function toggleExpand() {
    setExpanded(prev => {
      const next = !prev;
      if (next && !hydrated) { setHydrated(true); onExpand?.(journey.id); }
      return next;
    });
  }

  const analyses = journey.analyses || [];
  const completed = analyses.filter(a => a.status === 'COMPLETED');
  const active = completed.find(a => a.id === activeId) || latestCompleted(journey);
  const overall = active ? RISK_CONFIG[active.overallRisk] : null;

  async function handleDelete() {
    if (!confirm(`Delete journey "${journey.name}" and its analyses?`)) return;
    await onDelete(journey.id);
  }

  return (
    <div className={`emo-card${expanded ? ' expanded' : ''}`}>
      <div className="emo-card-header" onClick={toggleExpand}>
        <div className="emo-card-icon"><Activity size={16} color="#fff" /></div>
        <div className="emo-card-meta">
          <div className="emo-card-title">{journey.name}</div>
          <div className="emo-card-sub">
            <span className="emo-tag">{typeLabel(journey.type)}</span>
            <span className="emo-card-steps">{journey.steps?.length || 0} steps</span>
            {active && overall && <span className="emo-risk-badge" style={{ color: overall.color, background: `${overall.color}18` }}>{overall.label} risk</span>}
            {completed.length > 0 && <span className="emo-card-runs">{completed.length} {completed.length === 1 ? 'analysis' : 'analyses'}</span>}
          </div>
        </div>
        <div className="emo-card-right" onClick={e => e.stopPropagation()}>
          <button className="db-btn db-btn-primary emo-analyze-btn" onClick={() => onAnalyze(journey)} disabled={analyzing}>
            {analyzing ? <><Loader2 size={13} className="emo-spin" /> Analyzing…</> : <><Play size={13} /> Analyze</>}
          </button>
          <button className="emo-icon-btn" title="Edit journey" onClick={() => onEdit(journey)}><Pencil size={14} /></button>
          <button className="emo-icon-btn danger" title="Delete journey" onClick={handleDelete}><Trash2 size={14} /></button>
          <button className="emo-expand" onClick={toggleExpand}>{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>
        </div>
      </div>

      {expanded && (
        <div className="emo-card-body">
          {/* Steps list */}
          <div className="emo-steps-preview">
            {(journey.steps || []).map(s => (
              <div key={s.id} className="emo-step-chip"><span>{s.order}</span> {s.title}</div>
            ))}
          </div>

          {completed.length === 0 ? (
            <div className="emo-no-analysis">
              <Activity size={26} color="var(--text-tertiary)" />
              <p>No analysis yet. Run an analysis to map the emotional experience of this journey.</p>
              <button className="db-btn db-btn-primary" onClick={() => onAnalyze(journey)} disabled={analyzing}>
                {analyzing ? <><Loader2 size={13} className="emo-spin" /> Analyzing…</> : <><Play size={13} /> Run Analysis</>}
              </button>
            </div>
          ) : (
            <>
              {completed.length > 1 && (
                <div className="emo-history-bar">
                  <button className="emo-history-toggle" onClick={() => setShowHistory(h => !h)}>
                    <History size={13} /> History ({completed.length}) {showHistory ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                  {showHistory && (
                    <div className="emo-history-list">
                      {completed.map(a => (
                        <div key={a.id} className={`emo-history-item${(active?.id === a.id) ? ' active' : ''}`} onClick={() => setActiveId(a.id)}>
                          <span>{formatDateTime(a.createdAt)}</span>
                          <span className="emo-history-risk" style={{ color: RISK_CONFIG[a.overallRisk]?.color }}>{RISK_CONFIG[a.overallRisk]?.label}</span>
                          <button className="emo-history-del" onClick={e => { e.stopPropagation(); onDeleteAnalysis(journey.id, a.id); }} title="Delete analysis"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {active && <AnalysisView journey={journey} analysis={active} onExport={onExport} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmotionSimulatorPage() {
  const { workspaceSlug } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);

  const fetchMetrics = useCallback(async () => {
    if (!workspaceSlug) return;
    try { const r = await emotionApi.metrics(workspaceSlug); setMetrics(r.data); }
    catch { /* metrics are best-effort */ }
  }, [workspaceSlug]);

  const fetchJourneys = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    setError('');
    try { const r = await emotionApi.listJourneys(workspaceSlug); setJourneys(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load journeys'); }
    finally { setLoading(false); }
  }, [workspaceSlug]);

  useEffect(() => { fetchJourneys(); fetchMetrics(); }, [fetchJourneys, fetchMetrics]);

  async function handleSave(data) {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        const r = await emotionApi.updateJourney(editing.id, data);
        setJourneys(prev => prev.map(j => j.id === editing.id ? r.data : j));
      } else {
        const r = await emotionApi.createJourney(workspaceSlug, data);
        setJourneys(prev => [r.data, ...prev]);
      }
      setShowModal(false);
      setEditing(null);
      fetchMetrics();
    } catch (e) {
      setError(e.message || 'Failed to save journey');
    } finally {
      setSaving(false);
    }
  }

  async function hydrateJourney(id) {
    try {
      const r = await emotionApi.getJourney(id);
      if (r.data) setJourneys(prev => prev.map(j => j.id === id ? { ...j, ...r.data } : j));
    } catch { /* keep in-memory data if hydration fails */ }
  }

  async function handleAnalyze(journey) {
    setAnalyzingId(journey.id);
    setError('');
    try {
      const r = await emotionApi.analyze(journey.id);
      setJourneys(prev => prev.map(j =>
        j.id === journey.id ? { ...j, analyses: [r.data, ...(j.analyses || [])] } : j
      ));
      fetchMetrics();
    } catch (e) {
      setError(e.message || 'Analysis failed');
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleDelete(id) {
    try {
      await emotionApi.deleteJourney(id);
      setJourneys(prev => prev.filter(j => j.id !== id));
      fetchMetrics();
    } catch (e) { setError(e.message || 'Delete failed'); }
  }

  async function handleDeleteAnalysis(journeyId, analysisId) {
    try {
      await emotionApi.deleteAnalysis(analysisId);
      setJourneys(prev => prev.map(j =>
        j.id === journeyId ? { ...j, analyses: (j.analyses || []).filter(a => a.id !== analysisId) } : j
      ));
      fetchMetrics();
    } catch (e) { setError(e.message || 'Delete failed'); }
  }

  return (
    <>
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Emotion Simulator</h1>
          <p className="db-page-subtitle">Analyze user journeys to predict emotional states, friction, and drop-off risk</p>
        </div>
        <button className="db-btn db-btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={14} /> New Journey</button>
      </div>

      {/* Dashboard metrics */}
      <div className="emo-metrics-row">
        {METRIC_META.map(mt => {
          const Icon = mt.icon;
          const v = metrics?.metrics?.[mt.key];
          return (
            <div key={mt.key} className="emo-metric-card">
              <div className="emo-metric-icon" style={{ background: `${scoreColor(v, mt.invert)}18` }}>
                <Icon size={16} color={scoreColor(v, mt.invert)} />
              </div>
              <div className="emo-metric-body">
                <div className="emo-metric-number" style={{ color: v == null ? 'var(--text-tertiary)' : scoreColor(v, mt.invert) }}>
                  {v == null ? '—' : v}{v != null && <span className="emo-metric-unit">/100</span>}
                </div>
                <div className="emo-metric-name">{mt.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="emo-toolbar">
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {journeys.length} {journeys.length === 1 ? 'journey' : 'journeys'}
          {metrics?.analyzedJourneys ? ` · ${metrics.analysesCount} analyses run` : ''}
        </span>
        <button className="emo-refresh" onClick={() => { fetchJourneys(); fetchMetrics(); }} title="Refresh"><RefreshCw size={13} /></button>
      </div>

      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="emo-loading">{[1, 2, 3].map(i => <div key={i} className="emo-skeleton" />)}</div>
      ) : journeys.length === 0 ? (
        <div className="emo-empty">
          <div className="emo-empty-icon"><Activity size={32} color="var(--text-tertiary)" /></div>
          <h3 className="emo-empty-title">No journeys yet</h3>
          <p className="emo-empty-subtitle">Build a user journey — onboarding, checkout, activation — and Kairo will analyze the emotional experience, friction points, and drop-off risk at every step.</p>
          <button className="db-btn db-btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}><Plus size={14} /> Create First Journey</button>
        </div>
      ) : (
        <div className="emo-list">
          {journeys.map(j => (
            <JourneyCard
              key={j.id}
              journey={j}
              analyzing={analyzingId === j.id}
              onAnalyze={handleAnalyze}
              onEdit={(jj) => { setEditing(jj); setShowModal(true); }}
              onDelete={handleDelete}
              onDeleteAnalysis={handleDeleteAnalysis}
              onExport={exportReport}
              onExpand={hydrateJourney}
            />
          ))}
        </div>
      )}

      {showModal && (
        <JourneyModal
          initial={editing}
          loading={saving}
          onClose={() => { if (!saving) { setShowModal(false); setEditing(null); } }}
          onSubmit={handleSave}
        />
      )}
    </>
  );
}
