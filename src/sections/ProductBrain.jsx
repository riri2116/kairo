import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const outputs = [
  {
    label: 'Impact Analysis',
    desc: 'How this decision affects your users, product, and competitive position — reasoned from your product context.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    label: 'Risk Assessment',
    desc: 'Execution risks, dependency chains, and edge cases surfaced before a sprint starts — not after it ships.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'Revenue & Retention',
    desc: 'Directional signal on how the decision moves your key growth levers — grounded in your business model, not generic benchmarks.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    label: 'Clear Recommendation',
    desc: 'A direct call — build, iterate, or pass — with the reasoning laid out so your team can challenge it, not just accept it.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
];

const steps = [
  { num: '01', text: 'Describe your idea, pricing change, or experiment in plain language.' },
  { num: '02', text: 'Kairo reads your product context, goals, and existing data signals.' },
  { num: '03', text: 'The analysis runs — impact, risk, revenue, and a recommendation.' },
];

export default function ProductBrain() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="product" ref={ref} style={{ padding: '140px 0', background: 'var(--surface)', scrollMarginTop: '90px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>

        {/* Left: What you get */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px', boxShadow: '0 32px 72px rgba(0,0,0,0.07)' }}>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>What you get in every analysis</div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Submit any product idea, pricing change, or growth experiment. Kairo returns a structured analysis — not a generic summary.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {outputs.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '18px 0',
                    borderBottom: i < outputs.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: 'var(--text-primary)',
                  }}>
                    {o.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{o.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{o.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--surface)', borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>How it works</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 20, paddingTop: 1 }}>{s.num}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.text}</span>
                  </div>
                ))}
              </div>
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
            Kairo's analysis engine works from your actual product context — not generic industry benchmarks. Every recommendation is grounded in your goals, your constraints, and your market.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Market fit probability scoring', detail: 'Know if the market wants it before you build.' },
              { label: 'Resource vs. ROI trade-offs', detail: 'See the return on every sprint before it starts.' },
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
