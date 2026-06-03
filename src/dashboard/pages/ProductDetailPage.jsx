import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, Package, Brain, Users, Target,
  FlaskConical, Map, FileText, BarChart2, Loader, RefreshCw,
} from 'lucide-react';
import { productsApi } from '../lib/api';
import ProductForm from '../components/ProductForm';

const STAGE_CONFIG = {
  IDEA:        { label: 'Idea',        color: '#888',    bg: '#F6F5F2' },
  DISCOVERY:   { label: 'Discovery',   color: '#6366f1', bg: '#EEF2FF' },
  DEVELOPMENT: { label: 'Development', color: '#f97316', bg: '#FFF7ED' },
  BETA:        { label: 'Beta',        color: '#0ea5e9', bg: '#F0F9FF' },
  LAUNCHED:    { label: 'Launched',    color: '#22c55e', bg: '#F0FDF4' },
  SCALING:     { label: 'Scaling',     color: '#a855f7', bg: '#FDF4FF' },
};

const RELATED_LINKS = [
  { key: 'simulations',       label: 'Simulations',    icon: Brain,       path: '/dashboard/product-brain', color: '#EEF2FF', iconColor: '#6366f1' },
  { key: 'boardroomSessions', label: 'AI Boardroom',   icon: Users,       path: '/dashboard/boardroom',     color: '#FFF7ED', iconColor: '#f97316' },
  { key: 'competitorAnalyses',label: 'Competitors',    icon: Target,      path: '/dashboard/competitors',   color: '#F0FDF4', iconColor: '#22c55e' },
  { key: 'featureSandboxes',  label: 'Feature Sandbox',icon: FlaskConical,path: '/dashboard/sandbox',       color: '#FDF4FF', iconColor: '#a855f7' },
  { key: 'roadmaps',          label: 'Roadmaps',       icon: Map,         path: '/dashboard/roadmaps',      color: '#F0F9FF', iconColor: '#0ea5e9' },
  { key: 'requirements',      label: 'Requirements',   icon: FileText,    path: '/dashboard/requirements',  color: '#F6F5F2', iconColor: '#888'    },
  { key: 'predictions',       label: 'Predictions',    icon: BarChart2,   path: '/dashboard/analytics',     color: '#FFF7F0', iconColor: '#f59e0b' },
];

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ paddingBottom: 16, borderBottom: '1px solid #F6F5F2' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#333', lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.get(id);
      setProduct(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleSave(data) {
    setSaving(true);
    try {
      const res = await productsApi.update(id, data);
      setProduct(res.data);
      setFormOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await productsApi.delete(id);
      navigate('/dashboard/products');
    } catch (err) {
      alert(err.message || 'Failed to delete');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 10, color: '#aaa' }}>
        <Loader size={18} className="db-spin" />
        <span style={{ fontSize: 14 }}>Loading product…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="db-empty">
        <div className="db-empty-icon"><Package size={22} /></div>
        <div className="db-empty-title">Failed to load product</div>
        <div className="db-empty-desc">{error}</div>
        <button className="db-btn-primary" onClick={load} style={{ marginTop: 8 }}><RefreshCw size={13} /> Retry</button>
      </div>
    );
  }

  if (!product) return null;

  const stage = STAGE_CONFIG[product.stage] || STAGE_CONFIG.IDEA;
  const counts = product._count || {};

  return (
    <>
      {/* Back + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => navigate('/dashboard/products')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', fontFamily: 'inherit' }}
        >
          <ArrowLeft size={14} /> Products
        </button>
        <div style={{ flex: 1 }} />
        <button className="db-btn-ghost" onClick={() => setFormOpen(true)}>
          <Pencil size={13} /> Edit
        </button>
        <button
          className="db-btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? <Loader size={13} className="db-spin" /> : <Trash2 size={13} />}
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {/* Hero header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: stage.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package size={26} color={stage.color} />
        </div>
        <div>
          <h1 className="db-page-title" style={{ marginBottom: 8 }}>{product.name}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: stage.color, background: stage.bg, padding: '3px 10px', borderRadius: 100 }}>
              {stage.label}
            </span>
            {product.industry && (
              <span style={{ fontSize: 12, color: '#888', background: '#F6F5F2', padding: '3px 10px', borderRadius: 100 }}>
                {product.industry}
              </span>
            )}
            <span style={{ fontSize: 11.5, color: '#bbb' }}>
              Updated {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left: details */}
        <div>
          <div className="db-card">
            <div className="db-card-header" style={{ marginBottom: 20 }}>
              <span className="db-card-title">Product details</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <DetailRow label="Description"     value={product.description}    />
              <DetailRow label="Target Audience" value={product.targetAudience} />
              <DetailRow label="Business Goal"   value={product.businessGoal}   />
              <DetailRow label="Pricing Model"   value={product.pricingModel}   />
              {!product.description && !product.targetAudience && !product.businessGoal && !product.pricingModel && (
                <div style={{ padding: '20px 0', color: '#bbb', fontSize: 13, textAlign: 'center' }}>
                  No details added yet.{' '}
                  <button onClick={() => setFormOpen(true)} style={{ color: '#111', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>
                    Edit product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: related features */}
        <div>
          <div className="db-card">
            <div className="db-card-header" style={{ marginBottom: 16 }}>
              <span className="db-card-title">Feature areas</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RELATED_LINKS.map(({ key, label, icon: Icon, path, color, iconColor }) => (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: 'none', border: '1px solid #F0EFEB', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#E5E4E0'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#F0EFEB'}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={iconColor} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#333', flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 14, fontFamily: 'Instrument Serif, serif', color: '#111', lineHeight: 1, minWidth: 20, textAlign: 'right' }}>
                    {counts[key] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={product}
        loading={saving}
      />
    </>
  );
}
