import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const personas = [
  { initials: 'CE', role: 'Founder & CEO', stance: 'Champion', color: '#111111', quote: "This directly accelerates our 10-year vision. I've seen this pattern work at three previous companies." },
  { initials: 'CT', role: 'CTO', stance: 'Cautious', color: '#555555', quote: "Technically feasible, but we're looking at 3 sprints minimum. We need to de-risk the ML pipeline first." },
  { initials: 'GP', role: 'Growth PM', stance: 'Champion', color: '#111111', quote: "Our top acquisition channel is organic search. This is a massive SEO play — we'd own the keyword cluster." },
  { initials: 'UX', role: 'UX Researcher', stance: 'Champion', color: '#111111', quote: "We tested this concept with 28 users last month. Net sentiment was 4.4/5. Confusion was limited to edge cases." },
  { initials: 'FL', role: 'Finance Lead', stance: 'Neutral', color: '#888888', quote: "ROI projections look strong at 18 months. Payback period depends on infrastructure costs we haven't modeled yet." },
];

export default function Boardroom() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '140px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'start' }}>

        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'sticky', top: 100 }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>03 — AI Boardroom</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            Every perspective,<br />before the first<br />meeting happens.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Five AI personas — trained on your product context — debate every feature from the angles that matter: strategy, engineering, growth, UX, and finance.
          </p>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Decision Summary</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ label: 'Champions', count: '3', color: '#111' }, { label: 'Cautious', count: '1', color: '#888' }, { label: 'Neutral', count: '1', color: '#aaa' }].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: 'Instrument Serif, serif' }}>{s.count}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Debate cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {personas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', display: 'flex', gap: 16 }}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}>{p.initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.role}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: p.stance === 'Champion' ? '#16a34a' : p.stance === 'Cautious' ? '#d97706' : 'var(--text-secondary)', background: p.stance === 'Champion' ? '#f0fdf4' : p.stance === 'Cautious' ? '#fffbeb' : 'rgba(0,0,0,0.04)', padding: '3px 10px', borderRadius: 100 }}>
                    {p.stance}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>&ldquo;{p.quote}&rdquo;</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
