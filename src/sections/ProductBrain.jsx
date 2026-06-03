import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const bars = [38, 52, 44, 71, 60, 88, 76, 95, 82];
const metrics = [
  { label: 'Market Fit Score', value: '94', unit: '/100', desc: 'Based on 240 signals' },
  { label: 'Predicted MAU', value: '+12.4k', unit: '', desc: 'Next 90 days' },
  { label: 'Revenue Delta', value: '+$45k', unit: ' MRR', desc: 'Annualized estimate' },
  { label: 'Churn Risk', value: '2.1', unit: '%', desc: 'Below industry avg' },
];

export default function ProductBrain() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={{ padding: '140px 0', background: '#ffffff' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>

        {/* Left: Product mockup */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', boxShadow: '0 32px 72px rgba(0,0,0,0.07)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Prediction Confidence</div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 52, fontWeight: 400, lineHeight: 1, color: 'var(--text-primary)' }}>82.4%</div>
              </div>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 500, color: '#16a34a' }}>
                ↑ High
              </div>
            </div>

            {/* Bar chart */}
            <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 7, marginBottom: 28 }}>
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${h}%` } : { height: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{ flex: 1, background: i === 7 ? 'var(--text-primary)' : 'var(--border)', borderRadius: '4px 4px 0 0' }}
                />
              ))}
            </div>

            {/* Metric grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}
                >
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {m.value}<span style={{ fontSize: 13, fontWeight: 400 }}>{m.unit}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>02 — Product Brain</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            Predict outcomes<br />before you write<br />a single line of code.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Kairo's prediction engine models your historical data, market signals, and competitor movements to build probability models for every roadmap decision.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Market fit probability scoring', detail: 'Know if the market wants it before you build.' },
              { label: 'Resource vs. ROI optimization', detail: 'See the return on every sprint before it starts.' },
              { label: 'Cannibalization risk detection', detail: 'Protect your existing features from unintended harm.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ paddingBottom: 20, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
