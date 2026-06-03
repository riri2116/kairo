import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const RESPONSE = [
  { id: 0, delay: 400,  type: 'status', text: 'Running 14,200 session simulations...' },
  { id: 1, delay: 1200, type: 'metric', label: 'Retention Impact', value: '+23%',  sub: 'vs. baseline cohort', good: true },
  { id: 2, delay: 1700, type: 'metric', label: 'Risk Score',       value: 'Medium', sub: 'Onboarding friction detected', good: null },
  { id: 3, delay: 2200, type: 'metric', label: 'Confidence',       value: '82%',   sub: 'High-signal data available', good: true },
  { id: 4, delay: 3000, type: 'rec',    text: 'Launch as a phased beta. Power users show strong intent — but first-session drop-off could cap adoption. Pair with an in-app tutorial before full rollout.' },
];

function AnimatedResponse({ active }) {
  const [shown, setShown] = useState([]);
  useEffect(() => {
    if (!active) return;
    RESPONSE.forEach(item => {
      setTimeout(() => setShown(p => [...p, item.id]), item.delay);
    });
  }, [active]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {RESPONSE.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={shown.includes(item.id) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {item.type === 'status' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div
                animate={shown.includes(item.id) ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ repeat: 3, duration: 0.6 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{item.text}</span>
            </div>
          )}
          {item.type === 'metric' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161616', border: '1px solid #252525', borderRadius: 10, padding: '14px 18px' }}>
              <div>
                <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.05em', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{item.sub}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'monospace', color: item.good === true ? '#4ade80' : item.good === false ? '#f87171' : '#f59e0b' }}>
                {item.value}
              </div>
            </div>
          )}
          {item.type === 'rec' && (
            <div style={{ background: '#111', border: '1px solid #252525', borderLeft: '2px solid #555', borderRadius: '0 10px 10px 10px', padding: '16px 18px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: 10, fontWeight: 600 }}>Kairo · Recommendation</div>
              <p style={{ fontSize: 13, color: '#bbb', lineHeight: 1.75 }}>{item.text}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function AITerminal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section ref={ref} style={{ padding: '140px 0', background: 'var(--bg)' }}>
      <div className="showcase-grid" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>01 — Decision Intelligence</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            Ask anything.<br />Get boardroom-<br />grade answers.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Type a product question. Kairo simulates thousands of scenarios against your live data and returns structured predictions — not opinions.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Simulates across 100+ outcome variables', 'Surfaces risks before they become blockers', 'Updates live as your data changes'].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: '#0c0c0c', borderRadius: 20, overflow: 'hidden', border: '1px solid #1e1e1e', boxShadow: '0 48px 96px rgba(0,0,0,0.22), 0 12px 32px rgba(0,0,0,0.12)' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#444', fontFamily: 'monospace' }}>kairo — simulation engine</span>
            </div>
            <div style={{ padding: '28px 22px' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1e1e1e', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: '#666', fontWeight: 700 }}>PM</span>
                </div>
                <div style={{ background: '#181818', border: '1px solid #252525', borderRadius: '2px 12px 12px 12px', padding: '12px 16px' }}>
                  <p style={{ fontSize: 14, color: '#ddd', margin: 0 }}>Should we launch AI flashcards?</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: '#111', fontWeight: 800 }}>K</span>
                </div>
                <div style={{ flex: 1 }}>
                  <AnimatedResponse active={inView} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
