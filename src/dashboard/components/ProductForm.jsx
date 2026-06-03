import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

const STAGES = [
  { value: 'IDEA',        label: 'Idea'        },
  { value: 'DISCOVERY',   label: 'Discovery'   },
  { value: 'DEVELOPMENT', label: 'Development' },
  { value: 'BETA',        label: 'Beta'        },
  { value: 'LAUNCHED',    label: 'Launched'    },
  { value: 'SCALING',     label: 'Scaling'     },
];

const EMPTY = {
  name: '', description: '', targetAudience: '',
  businessGoal: '', pricingModel: '', industry: '', stage: 'IDEA',
};

export default function ProductForm({ open, onClose, onSave, initial, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const isEdit = !!initial;

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        name:           initial.name           || '',
        description:    initial.description    || '',
        targetAudience: initial.targetAudience || '',
        businessGoal:   initial.businessGoal   || '',
        pricingModel:   initial.pricingModel   || '',
        industry:       initial.industry       || '',
        stage:          initial.stage          || 'IDEA',
      } : EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.name.length > 120) e.name = 'Max 120 characters';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = {
      name:           form.name.trim(),
      description:    form.description.trim()    || null,
      targetAudience: form.targetAudience.trim() || null,
      businessGoal:   form.businessGoal.trim()   || null,
      pricingModel:   form.pricingModel.trim()   || null,
      industry:       form.industry.trim()       || null,
      stage:          form.stage,
    };
    onSave(payload);
  }

  if (!open) return null;

  return (
    <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="db-modal">
        <div className="db-modal-header">
          <h2 className="db-modal-title">{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <button className="db-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <form className="db-modal-body" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="db-field">
            <label className="db-label">Product name <span className="db-required">*</span></label>
            <input
              className={`db-input ${errors.name ? 'error' : ''}`}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Kairo AI"
              autoFocus
            />
            {errors.name && <span className="db-field-error">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="db-field">
            <label className="db-label">Description</label>
            <textarea
              className="db-textarea"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What does this product do?"
              rows={3}
            />
          </div>

          {/* Two columns: stage + industry */}
          <div className="db-field-row">
            <div className="db-field">
              <label className="db-label">Stage</label>
              <select className="db-select" value={form.stage} onChange={e => set('stage', e.target.value)}>
                {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="db-field">
              <label className="db-label">Industry</label>
              <input
                className="db-input"
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                placeholder="e.g. EdTech, FinTech"
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="db-field">
            <label className="db-label">Target Audience</label>
            <textarea
              className="db-textarea"
              value={form.targetAudience}
              onChange={e => set('targetAudience', e.target.value)}
              placeholder="Who is this product for? e.g. Students aged 16-24 preparing for exams"
              rows={2}
            />
          </div>

          {/* Business Goal */}
          <div className="db-field">
            <label className="db-label">Business Goal</label>
            <textarea
              className="db-textarea"
              value={form.businessGoal}
              onChange={e => set('businessGoal', e.target.value)}
              placeholder="What is the primary business objective? e.g. Reach $1M ARR by Q4"
              rows={2}
            />
          </div>

          {/* Pricing Model */}
          <div className="db-field">
            <label className="db-label">Pricing Model</label>
            <input
              className="db-input"
              value={form.pricingModel}
              onChange={e => set('pricingModel', e.target.value)}
              placeholder="e.g. Freemium, SaaS subscription, One-time purchase"
            />
          </div>

          <div className="db-modal-footer">
            <button type="button" className="db-btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="db-btn-primary" disabled={loading}>
              {loading
                ? <><Loader size={13} className="db-spin" /> Saving…</>
                : isEdit ? 'Save changes' : 'Create product'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
