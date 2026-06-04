import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const horizons = [
  {
    range: '30 Days',
    title: 'Immediate signal',
    desc: 'Which user segments respond first, where activation friction lives, and what early retention tells you about product-market fit.',
  },
  {
    range: '90 Days',
    title: 'Growth trajectory',
    desc: 'Whether word-of-mouth is compounding, which acquisition channels are durable, and where churn is likely to emerge.',
  },
  {
    range: '1 Year',
    title: 'Strategic inflection',
    desc: 'When you reach category tipping points, how competitive pressure shifts, and which bets compound into a durable moat.',
  },
  {
    range: '3 Years',
    title: 'Long-run compounding',
    desc: 'How today\'s roadmap decisions accumulate — and which paths lead to leadership versus commoditization.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Define the decision',
    detail: 'Describe a roadmap choice — a feature, a pricing move, a go-to-market shift.',
  },
  {
    step: '02',
    title: 'Set your horizon',
    detail: 'Pick from 30 days to 3 years. Kairo models the same decision across every timeframe.',
  },
  {
    step: '03',
    title: 'See compounding effects',
    detail: 'Understand how each choice ripples through retention, acquisition, and revenue over time.',
  },
];

export default function TimeMachine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={{ padding: '140px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'start' }}>

        {/* Left: Horizon cards */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 72px rgba(0,0,0,0.07)' }}>
            {/* Header */}
            <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What Kairo models</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                The same decision — examined across four time horizons, so you understand both the short-term signal and the long-run consequence.
              </p>
            </div>

            {/* Horizon rows */}
            {horizons.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: 20,
                  padding: '22px 32px',
                  borderBottom: i < horizons.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'start',
                }}
              >
                <div style={{
                  padding: '6px 10px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                }}>
                  {h.range}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{h.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{h.desc}</div>
                </div>
              </motion.div>
            ))}

            {/* How it works */}
            <div style={{ padding: '24px 32px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>How it works</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {howItWorks.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 22, paddingTop: 2 }}>{s.step}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.detail}</div>
                    </div>
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
          style={{ paddingTop: 8 }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>05 — Product Time Machine</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            Fast-forward<br />to see how today's<br />decisions compound.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Every product decision has a ripple effect. Kairo models those ripples across 30 days, 90 days, one year, and beyond — so you make choices that compound in your favour, not against it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Compounding scenario modeling', detail: 'See how small decisions stack into large outcomes over time.' },
              { label: 'Milestone & inflection tracking', detail: 'Know when your next growth break is likely to hit.' },
              { label: 'Divergent path comparison', detail: 'Compare the long-run outcomes of Build A vs. Build B.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
