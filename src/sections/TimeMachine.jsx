import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const tabs = ['30 Days', '90 Days', '1 Year', '3 Years'];
const data = {
  '30 Days': {
    users: '4,200', rev: '$12k', ret: '42%', growth: '+18%',
    bars: [20, 32, 28, 45, 38, 50, 44, 55, 48, 60],
    desc: 'Early traction from power users. Onboarding funnel performing at 62%.'
  },
  '90 Days': {
    users: '18,500', rev: '$45k', ret: '58%', growth: '+41%',
    bars: [44, 52, 60, 56, 68, 72, 65, 80, 75, 88],
    desc: 'Word-of-mouth kicking in. Team channel acquisition growing at 23% WoW.'
  },
  '1 Year': {
    users: '145k', rev: '$320k', ret: '64%', growth: '+112%',
    bars: [60, 68, 72, 78, 74, 82, 80, 88, 85, 95],
    desc: 'Product-market fit confirmed. Enterprise tier launching Q3 driving MRR step-up.'
  },
  '3 Years': {
    users: '1.2M', rev: '$2.8M', ret: '71%', growth: '+380%',
    bars: [70, 76, 80, 85, 82, 88, 86, 92, 90, 98],
    desc: 'Category leadership established. International expansion driving next growth phase.'
  },
};

export default function TimeMachine() {
  const [active, setActive] = useState('90 Days');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const d = data[active];

  return (
    <section ref={ref} style={{ padding: '140px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>

        {/* Left: Visual */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 72px rgba(0,0,0,0.07)' }}>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  style={{
                    flex: 1, padding: '14px 8px', background: 'none', border: 'none',
                    borderBottom: active === tab ? '2px solid var(--text-primary)' : '2px solid transparent',
                    fontSize: 12, fontWeight: active === tab ? 600 : 400,
                    color: active === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.01em'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: '32px' }}>
              {/* Main metric */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active + '-header'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                    {[
                      { label: 'Projected Users', value: d.users },
                      { label: 'Projected MRR', value: d.rev },
                      { label: 'Retention Rate', value: d.ret },
                      { label: 'Compounded Growth', value: d.growth },
                    ].map((m, i) => (
                      <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{m.label}</div>
                        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, color: 'var(--text-primary)' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Chart */}
              <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', gap: 5, marginBottom: 20 }}>
                {d.bars.map((h, i) => (
                  <motion.div
                    key={active + i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{ flex: 1, background: i === d.bars.length - 1 ? 'var(--text-primary)' : 'var(--border)', borderRadius: '3px 3px 0 0' }}
                  />
                ))}
              </div>

              {/* Insight */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active + '-desc'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}
                >
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Kairo Insight</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Right: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>05 — Product Time Machine</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            Fast-forward<br />to see how today's<br />decisions compound.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Every product decision has a ripple effect. Kairo models those ripples over 30 days, 90 days, one year, and beyond — so you can make choices that compound in your favor.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Compounding scenario modeling', detail: 'See how small decisions stack into large outcomes.' },
              { label: 'Milestone & inflection tracking', detail: 'Know exactly when your next growth break will hit.' },
              { label: 'Divergent path comparison', detail: 'Compare outcomes of Build A vs. Build B side by side.' },
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
