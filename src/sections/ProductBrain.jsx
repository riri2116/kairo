import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const outputs = [
  {
    label: 'Impact analysis',
    desc: "How the decision actually plays out — for your users, your product, and whoever you're competing with. Based on your context, not generic assumptions.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    label: 'Risk rundown',
    desc: "The things that could go wrong — edge cases, dependencies, conflicts with existing features. Surfaced before your sprint starts, not after it ships.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'Revenue & retention signal',
    desc: "A directional read on how the decision moves your key numbers — grounded in your business model, not some generic SaaS benchmark.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    label: 'A clear call',
    desc: "Build it, iterate first, or pass — with the reasoning laid out so your team can push back if they disagree, not just nod along.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
];

const steps = [
  { num: '01', text: "Describe your idea, pricing change, or experiment — plain language, no template needed." },
  { num: '02', text: "Kairo reads your product context, goals, and any data signals you've shared." },
  { num: '03', text: "A structured analysis comes back: impact, risk, revenue, and a recommendation." },
];

const bullets = [
  { label: 'Market fit check', detail: 'Does the market actually want this? Know before you build.' },
  { label: 'Effort vs. return', detail: 'See the real return on a sprint before it starts.' },
  { label: 'Cannibalisation risk', detail: 'Spot when a new feature might quietly damage an existing one.' },
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
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>What comes back in every analysis</div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                Describe any idea, pricing change, or experiment. Kairo returns a proper analysis — not a bullet-point summary.
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
                    <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{o.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--surface)', borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Three steps</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 20, paddingTop: 2, opacity: 0.6 }}>{s.num}</span>
                    <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.text}</span>
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
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 600 }}>Product Brain</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 28 }}>
            Know what will work<br />before you write<br />a line of code.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: 400, marginBottom: 44 }}>
            Kairo works from your actual product context — your goals, your constraints, your users. So the analysis means something, rather than just sounding plausible.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bullets.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ paddingBottom: 20, borderBottom: i < bullets.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
