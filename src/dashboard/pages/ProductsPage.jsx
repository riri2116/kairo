import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Package, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import ProductForm from '../components/ProductForm';

const STAGE_CONFIG = {
  IDEA:        { label: 'Idea',        color: '#888',    bg: '#F6F5F2' },
  DISCOVERY:   { label: 'Discovery',   color: '#6366f1', bg: '#EEF2FF' },
  DEVELOPMENT: { label: 'Development', color: '#f97316', bg: '#FFF7ED' },
  BETA:        { label: 'Beta',        color: '#0ea5e9', bg: '#F0F9FF' },
  LAUNCHED:    { label: 'Launched',    color: '#22c55e', bg: '#F0FDF4' },
  SCALING:     { label: 'Scaling',     color: '#a855f7', bg: '#FDF4FF' },
};

export default function ProductsPage() {
  const { activeSlug } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    if (!activeSlug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.list(activeSlug);
      setProducts(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeSlug]);

  useEffect(() => { load(); }, [load]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function h(e) { if (!e.target.closest('.db-product-menu')) setMenuOpen(null); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  async function handleSave(data) {
    setSaving(true);
    try {
      if (editing) {
        const res = await productsApi.update(editing.id, data);
        setProducts(ps => ps.map(p => p.id === editing.id ? res.data : p));
      } else {
        const res = await productsApi.create(activeSlug, data);
        setProducts(ps => [res.data, ...ps]);
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(product.id);
    try {
      await productsApi.delete(product.id);
      setProducts(ps => ps.filter(p => p.id !== product.id));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  }

  function openCreate() { setEditing(null); setFormOpen(true); }
  function openEdit(p)  { setEditing(p);    setFormOpen(true); }

  return (
    <>
      <div className="db-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="db-page-title">Products</h1>
          <p className="db-page-subtitle">
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} in your workspace`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="db-icon-btn" onClick={load} title="Refresh">
            <RefreshCw size={14} className={loading ? 'db-spin' : ''} />
          </button>
          <button className="db-btn-primary" onClick={openCreate}>
            <Plus size={14} /> New Product
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="db-alert db-alert-error" style={{ marginBottom: 20 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>Retry</button>
        </div>
      )}

      {/* No workspace configured */}
      {!activeSlug && !loading && (
        <div className="db-empty">
          <div className="db-empty-icon"><Package size={22} /></div>
          <div className="db-empty-title">No workspace selected</div>
          <div className="db-empty-desc">Sign in to your account to see your products.</div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1,2,3].map(i => (
            <div key={i} className="db-card db-skeleton" style={{ height: 160, marginBottom: 0 }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && activeSlug && products.length === 0 && (
        <div className="db-empty">
          <div className="db-empty-icon"><Package size={22} /></div>
          <div className="db-empty-title">No products yet</div>
          <div className="db-empty-desc">Create your first product to start simulating, predicting, and planning with AI.</div>
          <button className="db-btn-primary" onClick={openCreate} style={{ marginTop: 8 }}>
            <Plus size={14} /> Create your first product
          </button>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {products.map(product => {
            const stage = STAGE_CONFIG[product.stage] || STAGE_CONFIG.IDEA;
            const counts = product._count || {};
            return (
              <div key={product.id} className="db-product-card">
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: stage.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={17} color={stage.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.015em', lineHeight: 1.2 }}>{product.name}</div>
                      {product.industry && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{product.industry}</div>}
                    </div>
                  </div>

                  {/* Three-dot menu */}
                  <div className="db-product-menu" style={{ position: 'relative' }}>
                    <button
                      className="db-icon-btn"
                      style={{ width: 28, height: 28 }}
                      onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id)}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {menuOpen === product.id && (
                      <div className="db-dropdown" style={{ right: 0, top: 32, width: 160 }}>
                        <button className="db-dropdown-item" onClick={() => { setMenuOpen(null); navigate(`/dashboard/products/${product.id}`); }}>
                          <Eye size={13} /> View details
                        </button>
                        <button className="db-dropdown-item" onClick={() => { setMenuOpen(null); openEdit(product); }}>
                          <Pencil size={13} /> Edit
                        </button>
                        <div className="db-dropdown-sep" />
                        <button
                          className="db-dropdown-item danger"
                          onClick={() => { setMenuOpen(null); handleDelete(product); }}
                          disabled={deleting === product.id}
                        >
                          <Trash2 size={13} />
                          {deleting === product.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage badge */}
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: stage.color, background: stage.bg, padding: '3px 9px', borderRadius: 100, letterSpacing: '0.02em' }}>
                    {stage.label}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                  </p>
                )}

                {/* Counts */}
                <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  {[
                    ['Simulations', counts.simulations],
                    ['Requirements', counts.requirements],
                    ['Predictions', counts.predictions],
                  ].map(([label, count]) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontFamily: 'Instrument Serif, serif', color: 'var(--text-primary)', lineHeight: 1 }}>{count ?? 0}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 1 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* View button */}
                <button
                  className="db-product-view-btn"
                  onClick={() => navigate(`/dashboard/products/${product.id}`)}
                >
                  View details
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ProductForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
        loading={saving}
      />
    </>
  );
}
