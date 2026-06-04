import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

const inputs = [
  {
    label: 'Feature description',
    detail: 'Describe the feature in plain language — what it does and who it\'s for.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    label: 'Target audience',
    detail: 'Which user segment or persona this feature is designed for.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Business goal',
    detail: 'Whether you\'re optimising for retention, activation, revenue, or something else.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
];

const outputs = [
  {
    label: 'Retention impact',
    detail: 'How the feature is likely to affect 30- and 90-day retention for the target segment.',
    color: '#16a34a',
  },
  {
    label: 'Revenue signal',
    detail: 'Whether the feature supports upsell, reduces churn risk, or is neutral on revenue.',
    color: '#2563eb',
  },
  {
    label: 'Effort vs. return',
    detail: 'A directional read on whether the investment is proportionate to the expected outcome.',
    color: '#d97706',
  },
  {
    label: 'Risk level',
    detail: 'Technical complexity, user adoption risk, and cannibalization of existing features.',
    color: '#dc2626',
  },
];

export default function FeatureImpactSandbox() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section container" ref={ref}>
      <div className="grid grid-cols-2 gap-2xl items-start">

        {/* Left: What you put in */}
        <FadeIn>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 20, fontWeight: 500 }}>06 — Feature Impact Sandbox</div>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>
            Test any feature idea<br />before a sprint begins.
          </h2>
          <p className="color-secondary text-lg" style={{ marginBottom: 'var(--spacing-lg)' }}>
            Describe a feature, tell Kairo who it's for and what you're optimising for — and get a structured impact assessment across retention, revenue, effort, and risk.
          </p>

          <div className="card" style={{ marginBottom: 'var(--spacing-md)', padding: '24px 28px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>What you provide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {inputs.map((inp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.09 }}
                  style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    padding: '14px 0',
                    borderBottom: i < inputs.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: 'var(--text-primary)', marginTop: 1,
                  }}>
                    {inp.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{inp.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{inp.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right: What you get back */}
        <FadeIn delay={0.15}>
          <div className="card" style={{ background: '#111', color: 'white', padding: '28px 32px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>What Kairo returns</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {outputs.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.1 }}
                  style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    padding: '18px 0',
                    borderBottom: i < outputs.length - 1 ? '1px solid #222' : 'none',
                  }}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: o.color, flexShrink: 0, marginTop: 5,
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', marginBottom: 4 }}>{o.label}</div>
                    <div style={{ fontSize: 13, color: '#888', lineHeight: 1.65 }}>{o.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: '16px 20px', background: '#1a1a1a', borderRadius: 10, border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>No spreadsheets. No guesswork.</div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, margin: 0 }}>
                Every assessment is grounded in your product's specific context — not generic industry averages or hand-wavy estimates.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: '18px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Results are saved to your workspace so your team can review, comment, and compare assessments across different feature ideas.
              </p>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
