import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain, Plus, Trash2, Download, ChevronRight, ChevronDown,
  Lightbulb, Zap, DollarSign, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, XCircle, Loader2, X, Filter, RefreshCw,
} from 'lucide-react';
import { brainApi } from '../lib/api';
import { useAuth } from '../lib/auth';

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBMISSION_TYPES = [
  { value: 'PRODUCT_IDEA',      label: 'Product Idea',      icon: Lightbulb, color: '#6366f1' },
  { value: 'FEATURE_IDEA',      label: 'Feature Idea',      icon: Zap,       color: '#8b5cf6' },
  { value: 'PRICING_CHANGE',    label: 'Pricing Change',    icon: DollarSign,color: '#10b981' },
  { value: 'GROWTH_EXPERIMENT', label: 'Growth Experiment', icon: TrendingUp,color: '#f59e0b' },
];

const RISK_CONFIG = {
  LOW:      { color: '#22c55e', bg: '#22c55e18', label: 'Low Risk'      },
  MEDIUM:   { color: '#f59e0b', bg: '#f59e0b18', label: 'Medium Risk'   },
  HIGH:     { color: '#ef4444', bg: '#ef444418', label: 'High Risk'     },
  CRITICAL: { color: '#7c2d12', bg: '#7c2d1218', label: 'Critical Risk' },
};

const STATUS_CONFIG = {
  PENDING:   { icon: Clock,         color: '#94a3b8', label: 'Pending'   },
  RUNNING:   { icon: Loader2,       color: '#6366f1', label: 'Running'   },
  COMPLETED: { icon: CheckCircle2,  color: '#22c55e', label: 'Completed' },
  FAILED:    { icon: XCircle,       color: '#ef4444', label: 'Failed'    },
};

const ANALYSIS_SECTIONS = [
  { key: 'impactAnalysis',      label: 'Impact Analysis',       icon: Brain       },
  { key: 'riskAssessment',      label: 'Risk Assessment',       icon: AlertTriangle },
  { key: 'technicalComplexity', label: 'Technical Complexity',  icon: Zap         },
  { key: 'revenueImpact',       label: 'Revenue Impact',        icon: DollarSign  },
  { key: 'retentionImpact',     label: 'Retention Impact',      icon: TrendingUp  },
  { key: 'recommendation',      label: 'Recommendation',        icon: CheckCircle2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeConfig(value) {
  return SUBMISSION_TYPES.find(t => t.value === value) || SUBMISSION_TYPES[0];
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function exportAnalysis(analysis) {
  const tc = typeConfig(analysis.submissionType);
  const risk = RISK_CONFIG[analysis.riskLevel] || {};
  const lines = [
    `KAIRO — PRODUCT BRAIN ANALYSIS`,
    `${'='.repeat(50)}`,
    ``,
    `Title:    ${analysis.title}`,
    `Type:     ${tc.label}`,
    `Risk:     ${risk.label || analysis.riskLevel || '—'}`,
    `Confidence: ${analysis.confidenceScore ?? '—'}%`,
    `Date:     ${formatDate(analysis.createdAt)}`,
    ``,
    ...ANALYSIS_SECTIONS.map(s => [
      `${s.label.toUpperCase()}`,
      `-`.repeat(s.label.length),
      analysis[s.key] || '—',
      ``,
    ]).flat(),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `brain-${analysis.id.slice(0, 8)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SubmitModal ──────────────────────────────────────────────────────────────

function SubmitModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    submissionType: 'PRODUCT_IDEA',
    title: '',
    input: '',
  });
  const [error, setError] = useState('');

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    if (form.input.trim().length < 10) return setError('Please provide at least 10 characters of description.');
    await onSubmit(form);
  }

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="db-modal brain-modal">
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brain-modal-icon">
              <Brain size={18} color="#fff" />
            </div>
            <div>
              <h2 className="db-modal-title">New Analysis</h2>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>AI-powered product intelligence</p>
            </div>
          </div>
          {!loading && (
            <button className="db-modal-close" onClick={onClose}><X size={16} /></button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="db-modal-body">
            {/* Submission type */}
            <div className="db-form-group">
              <label className="db-form-label">Analysis Type</label>
              <div className="brain-type-grid">
                {SUBMISSION_TYPES.map(t => {
                  const Icon = t.icon;
                  const active = form.submissionType === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      className={`brain-type-btn${active ? ' active' : ''}`}
                      style={active ? { borderColor: t.color, background: `${t.color}12` } : {}}
                      onClick={() => set('submissionType', t.value)}
                    >
                      <Icon size={16} color={active ? t.color : '#888'} />
                      <span style={{ color: active ? t.color : '#555' }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="db-form-group">
              <label className="db-form-label">Title <span className="db-form-required">*</span></label>
              <input
                className="db-form-input"
                placeholder="e.g. Add AI-powered search to onboarding flow"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                maxLength={200}
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="db-form-group">
              <label className="db-form-label">
                Description <span className="db-form-required">*</span>
                <span className="db-form-hint"> — be specific for better analysis</span>
              </label>
              <textarea
                className="db-form-input brain-textarea"
                placeholder="Describe your idea, the problem it solves, the target users, and any constraints or context that would help with analysis..."
                value={form.input}
                onChange={e => set('input', e.target.value)}
                maxLength={5000}
                disabled={loading}
                rows={7}
              />
              <div style={{ fontSize: 11, color: '#bbb', textAlign: 'right', marginTop: 4 }}>
                {form.input.length} / 5000
              </div>
            </div>

            {error && <div className="db-alert db-alert-error">{error}</div>}

            {loading && (
              <div className="brain-running-state">
                <Loader2 size={20} className="brain-spin" color="#6366f1" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Analyzing with GPT-4o…</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>This usually takes 5–15 seconds</div>
                </div>
              </div>
            )}
          </div>

          <div className="db-modal-footer">
            <button type="button" className="db-btn db-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary brain-submit-btn" disabled={loading}>
              {loading ? (
                <><Loader2 size={14} className="brain-spin" /> Analyzing…</>
              ) : (
                <><Brain size={14} /> Run Analysis</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── AnalysisCard ─────────────────────────────────────────────────────────────

function AnalysisCard({ analysis, onDelete, onExport }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const tc       = typeConfig(analysis.submissionType);
  const TypeIcon = tc.icon;
  const sc       = STATUS_CONFIG[analysis.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = sc.icon;
  const rc       = analysis.riskLevel ? RISK_CONFIG[analysis.riskLevel] : null;
  const isComplete = analysis.status === 'COMPLETED';

  async function handleDelete() {
    if (!confirm('Delete this analysis? This cannot be undone.')) return;
    setDeleting(true);
    await onDelete(analysis.id);
  }

  return (
    <div className={`brain-card${expanded ? ' expanded' : ''}`}>
      {/* Card header */}
      <div className="brain-card-header" onClick={() => isComplete && setExpanded(e => !e)}>
        <div className="brain-card-type-dot" style={{ background: tc.color }}>
          <TypeIcon size={13} color="#fff" />
        </div>

        <div className="brain-card-meta">
          <div className="brain-card-title">{analysis.title}</div>
          <div className="brain-card-sub">
            <span className="brain-tag" style={{ color: tc.color, background: `${tc.color}15` }}>
              {tc.label}
            </span>
            {analysis.product && (
              <span className="brain-tag" style={{ color: '#666', background: '#f3f3f3' }}>
                {analysis.product.name}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: sc.color }}>
              <StatusIcon size={11} className={analysis.status === 'RUNNING' ? 'brain-spin' : ''} />
              {sc.label}
            </span>
          </div>
        </div>

        <div className="brain-card-right">
          {isComplete && rc && (
            <span className="brain-risk-badge" style={{ color: rc.color, background: rc.bg }}>
              {rc.label}
            </span>
          )}
          {isComplete && analysis.confidenceScore != null && (
            <div className="brain-confidence">
              <div className="brain-confidence-value">{Math.round(analysis.confidenceScore)}%</div>
              <div className="brain-confidence-label">confidence</div>
            </div>
          )}
          <div className="brain-card-date">{formatDate(analysis.createdAt)}</div>

          <div className="brain-card-actions" onClick={e => e.stopPropagation()}>
            {isComplete && (
              <button
                className="brain-action-btn"
                title="Export analysis"
                onClick={() => onExport(analysis)}
              >
                <Download size={14} />
              </button>
            )}
            <button
              className="brain-action-btn danger"
              title="Delete analysis"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 size={14} className="brain-spin" /> : <Trash2 size={14} />}
            </button>
          </div>

          {isComplete && (
            <div className="brain-expand-icon">
              {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </div>
          )}
        </div>
      </div>

      {/* Expanded results */}
      {expanded && isComplete && (
        <div className="brain-card-body">
          <div className="brain-sections">
            {ANALYSIS_SECTIONS.map(s => {
              const SIcon = s.icon;
              const content = analysis[s.key];
              if (!content) return null;
              return (
                <div key={s.key} className={`brain-section${s.key === 'recommendation' ? ' brain-section-highlight' : ''}`}>
                  <div className="brain-section-label">
                    <SIcon size={13} />
                    {s.label}
                  </div>
                  <p className="brain-section-text">{content}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductBrainPage() {
  const { workspaceSlug } = useAuth();
  const [analyses, setAnalyses]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [error, setError]         = useState('');

  const fetchAnalyses = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    setError('');
    try {
      const res = await brainApi.list(workspaceSlug, { type: filterType || undefined });
      setAnalyses(res.data || []);
      setPagination(res.pagination || null);
    } catch (e) {
      setError(e.message || 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug, filterType]);

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  async function handleCreate(formData) {
    setSubmitting(true);
    setError('');
    try {
      const res = await brainApi.create(workspaceSlug, formData);
      setShowModal(false);
      setAnalyses(prev => [res.data, ...prev]);
    } catch (e) {
      setError(e.message || 'Analysis failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await brainApi.delete(id);
      setAnalyses(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  }

  const counts = SUBMISSION_TYPES.reduce((acc, t) => {
    acc[t.value] = analyses.filter(a => a.submissionType === t.value).length;
    return acc;
  }, {});

  return (
    <>
      {/* Header */}
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Product Brain</h1>
          <p className="db-page-subtitle">AI-powered analysis for ideas, features, pricing, and growth experiments</p>
        </div>
        <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> New Analysis
        </button>
      </div>

      {/* Stats row */}
      <div className="brain-stats-row">
        {SUBMISSION_TYPES.map(t => {
          const Icon = t.icon;
          return (
            <div
              key={t.value}
              className={`brain-stat-card${filterType === t.value ? ' active' : ''}`}
              style={filterType === t.value ? { borderColor: t.color, background: `${t.color}08` } : {}}
              onClick={() => setFilterType(filterType === t.value ? '' : t.value)}
            >
              <div className="brain-stat-icon" style={{ background: `${t.color}18` }}>
                <Icon size={16} color={t.color} />
              </div>
              <div>
                <div className="brain-stat-count" style={filterType === t.value ? { color: t.color } : {}}>
                  {counts[t.value] || 0}
                </div>
                <div className="brain-stat-label">{t.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="brain-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {filterType && (
            <span className="brain-filter-badge">
              <Filter size={11} />
              {typeConfig(filterType).label}
              <button onClick={() => setFilterType('')}><X size={11} /></button>
            </span>
          )}
          {pagination && (
            <span style={{ fontSize: 12, color: '#aaa' }}>
              {pagination.total} {pagination.total === 1 ? 'analysis' : 'analyses'}
            </span>
          )}
        </div>
        <button className="brain-refresh-btn" onClick={fetchAnalyses} title="Refresh">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Error */}
      {error && <div className="db-alert db-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Content */}
      {loading ? (
        <div className="brain-loading">
          {[1, 2, 3].map(i => (
            <div key={i} className="brain-skeleton" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="brain-empty">
          <div className="brain-empty-icon">
            <Brain size={32} color="#ccc" />
          </div>
          <h3 className="brain-empty-title">
            {filterType ? `No ${typeConfig(filterType).label} analyses yet` : 'No analyses yet'}
          </h3>
          <p className="brain-empty-subtitle">
            Submit a product idea, feature, pricing change, or growth experiment to get AI-powered insights.
          </p>
          <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Run Your First Analysis
          </button>
        </div>
      ) : (
        <div className="brain-list">
          {analyses.map(a => (
            <AnalysisCard
              key={a.id}
              analysis={a}
              onDelete={handleDelete}
              onExport={exportAnalysis}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <SubmitModal
          loading={submitting}
          onClose={() => !submitting && setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  );
}
