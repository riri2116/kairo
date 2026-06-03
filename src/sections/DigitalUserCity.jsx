import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const segments = [
  { name: 'Power Users',  count: '12,450', pct: 20, desc: 'Using 5+ features daily. Core loop locked.', dot: '#111', activity: [88,92,85,95,90,97,93,98] },
  { name: 'Active Users', count: '45,800', pct: 74, desc: 'Engaged weekly. Strong retention signal.', dot: '#444', activity: [60,70,65,72,68,74,71,75] },
  { name: 'At-Risk',      count: '3,200',  pct: 5,  desc: 'Drop in weekly sessions over 14 days.', dot: '#d97706', activity: [50,42,45,38,40,32,35,28] },
  { name: 'Churned',      count: '1,150',  pct: 2,  desc: 'No activity for 30+ days. Winback eligible.', dot: '#ef4444', activity: [30,25,20,18,15,10,8,5] },
];

function MiniSparkline({ values, color }) {
  const w = 80, h = 28;
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DigitalUserCity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={{ padding: '140px 0', background: '#ffffff' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>

        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>06 — Digital User City</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            Your users,<br />visualized as a<br />living ecosystem.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Don't just count users. Understand them. Kairo segments your user base in real-time and shows how each group shifts when you simulate a product decision.
          </p>

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', marginBottom: 36 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Simulated Post-Launch Shift</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Power Users', change: '+12%', positive: true },
                { label: 'Active Users', change: '+5%', positive: true },
                { label: 'At-Risk', change: '−34%', positive: true },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>{s.change}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Real-time segment health monitoring', 'Simulate feature impact per segment', 'Winback playbooks for churned users'].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Right: Segment cards */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {segments.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.dot, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{seg.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{seg.pct}% of user base</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, color: 'var(--text-primary)', textAlign: 'right' }}>{seg.count}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, maxWidth: '60%', lineHeight: 1.5 }}>{seg.desc}</p>
                  <MiniSparkline values={seg.activity} color={seg.dot} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
