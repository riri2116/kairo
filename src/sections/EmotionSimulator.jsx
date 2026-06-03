import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stages = [
  { x: 5,  y: 62, label: 'Excited',    stage: 'Discovery',    note: 'High anticipation' },
  { x: 25, y: 32, label: 'Confused',   stage: 'Sign-up',      note: 'Too many fields' },
  { x: 45, y: 75, label: 'Hopeful',    stage: 'First run',    note: 'Guided well' },
  { x: 65, y: 18, label: 'Aha!',       stage: 'First value',  note: 'Core insight lands' },
  { x: 85, y: 28, label: 'Confident',  stage: 'Habit formed', note: 'Daily active' },
];

function toSVGPath(pts) {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    d.push(`C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`);
  }
  return d.join(' ');
}

const pathD = toSVGPath(stages);

// Continuous "breathing" frames — small offsets around the base emotional arc
// so the line keeps drifting up and down while preserving its shape.
const STAGE_X = stages.map(s => s.x);
const FRAME_YS = [
  stages.map(s => s.y),          // base
  [58, 27, 80, 13, 33],
  [66, 37, 70, 23, 23],
  [60, 30, 78, 16, 30],
];
const buildPath = ys => toSVGPath(STAGE_X.map((x, i) => ({ x, y: ys[i] })));
// Loop the first frame onto the end for a seamless cycle.
const LOOP_YS    = [...FRAME_YS, FRAME_YS[0]];
const LINE_FRAMES = LOOP_YS.map(buildPath);
const AREA_FRAMES = LOOP_YS.map(ys => buildPath(ys) + ' L 85 100 L 5 100 Z');
const POINT_CY    = stages.map((_, i) => LOOP_YS.map(ys => ys[i]));
const MORPH_DURATION = 9;

const GLYPH_DASHES = [
  { x: 40.5, y: 6 },
  { x: 22.5, y: 18 }, { x: 40.5, y: 18 }, { x: 58.5, y: 18 },
  { x: 9.5, y: 30 }, { x: 25, y: 30 }, { x: 40.5, y: 30 }, { x: 56, y: 30 }, { x: 71.5, y: 30 },
  { x: 22.5, y: 42 }, { x: 40.5, y: 42 }, { x: 58.5, y: 42 },
  { x: 40.5, y: 54 },
];

function DashGlyph() {
  return (
    <svg viewBox="0 0 90 60" fill="none" aria-hidden="true">
      {GLYPH_DASHES.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width="9" height="3.4" rx="1.7" fill="#1a1a1a" opacity="0.82" />
      ))}
    </svg>
  );
}

export default function EmotionSimulator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="use-cases" ref={ref} style={{ padding: '140px 0', background: 'var(--surface)', scrollMarginTop: '90px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px 64px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 500 }}
        >
          Use Cases
        </motion.p>
        <div className="usecase-orbs" aria-hidden="true">
          <span className="usecase-pearl" style={{ top: '6%', left: '16%' }} />
          <span className="usecase-pearl" style={{ top: '4%', left: '80%' }} />
          <span className="usecase-pearl" style={{ bottom: '2%', left: '50%' }} />
          <div className="usecase-sphere s-coral"><DashGlyph /></div>
          <div className="usecase-sphere s-center"><DashGlyph /></div>
          <div className="usecase-sphere s-green"><DashGlyph /></div>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>

        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>04 — Emotion Simulator</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(38px, 3.8vw, 54px)', fontWeight: 400, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 28 }}>
            See how users<br />feel before they<br />ever touch your product.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 400, marginBottom: 44 }}>
            Map the emotional arc of every user journey. Identify where delight turns to frustration — and fix it before a single line of UX is designed.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'Pinpoint drop-off moments before launch',
              'Compare emotional journeys across personas',
              'Annotate friction points with AI-generated fixes',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Emotion chart */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 32px 72px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Emotional Journey</div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--text-primary)' }}>New User · Onboarding Flow</div>
              </div>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 100, padding: '6px 14px', fontSize: 11, fontWeight: 500, color: '#16a34a' }}>5 stages</div>
            </div>

            {/* Y-axis labels */}
            <div style={{ display: 'flex', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 12, fontSize: 10, color: 'var(--text-secondary)', height: 160, flexShrink: 0 }}>
                <span>Delighted</span>
                <span style={{ marginTop: 20 }}>Neutral</span>
                <span>Frustrated</span>
              </div>

              {/* Chart area */}
              <div style={{ flex: 1, position: 'relative' }}>
                <svg width="100%" height="160" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible', display: 'block' }}>
                  {/* Grid lines */}
                  {[20, 50, 80].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2,2" />
                  ))}

                  {/* Filled area */}
                  <motion.path
                    d={AREA_FRAMES[0]}
                    fill="rgba(0,0,0,0.03)"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1, d: AREA_FRAMES } : {}}
                    transition={{
                      opacity: { duration: 1.5, delay: 0.4 },
                      d: { duration: MORPH_DURATION, repeat: Infinity, ease: 'easeInOut', delay: 2.2 },
                    }}
                  />

                  {/* Main line */}
                  <motion.path
                    d={LINE_FRAMES[0]}
                    fill="none"
                    stroke="var(--text-primary)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1, d: LINE_FRAMES } : { pathLength: 0 }}
                    transition={{
                      pathLength: { duration: 2.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                      d: { duration: MORPH_DURATION, repeat: Infinity, ease: 'easeInOut', delay: 2.2 },
                    }}
                  />

                  {/* Points */}
                  {stages.map((p, i) => (
                    <motion.circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="2.2"
                      fill="var(--white)"
                      stroke="var(--text-primary)"
                      strokeWidth="1.5"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1, cy: POINT_CY[i] } : { scale: 0 }}
                      transition={{
                        scale: { duration: 0.4, delay: 0.6 + i * 0.35 },
                        cy: { duration: MORPH_DURATION, repeat: Infinity, ease: 'easeInOut', delay: 2.2 },
                      }}
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Stage labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingLeft: 60 }}>
              {stages.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.18 }}
                  style={{ textAlign: 'center', flex: 1 }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{p.stage}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
