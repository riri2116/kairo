import React from 'react';
import { FadeIn } from '../components/FadeIn';

const capabilities = [
  {
    label: 'Simulate before you build',
    desc: 'Test product decisions in a model before writing a single line of code.',
  },
  {
    label: 'Predict user reactions',
    desc: 'Understand how real segments would respond to a change, not just how they have.',
  },
  {
    label: 'Surface hidden risks',
    desc: 'Catch edge cases, friction points, and downside scenarios early.',
  },
  {
    label: 'Model long-run outcomes',
    desc: 'See how today\'s choices compound over 30 days, 90 days, and beyond.',
  },
];

const tools = [
  { name: 'Kairo', main: true },
  { name: 'BI tools', main: false },
  { name: 'Surveys', main: false },
  { name: 'Roadmap apps', main: false },
];

const matrix = [
  [true, false, false, false],
  [true, false, true,  false],
  [true, false, false, false],
  [true, false, false, false],
];

export default function CompetitorIntelligence() {
  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 20, fontWeight: 500 }}>Why teams switch</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(32px, 3.2vw, 48px)', fontWeight: 400, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 20 }}>
            Most product tools tell you what happened.<br />Kairo tells you what to do next.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Analytics dashboards show you the past. Surveys show you opinions. Kairo shows you what's likely to happen — and what to do about it.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ padding: '16px 28px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Capability</div>
            {tools.map((t, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: t.main ? 600 : 500,
                  color: t.main ? 'var(--white)' : 'var(--text-secondary)',
                  background: t.main ? 'var(--text-primary)' : 'transparent',
                }}
              >
                {t.name}
              </div>
            ))}
          </div>

          {capabilities.map((cap, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                borderBottom: i < capabilities.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
              }}
            >
              <div style={{ padding: '20px 28px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{cap.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{cap.desc}</div>
              </div>
              {matrix[i].map((has, j) => (
                <div
                  key={j}
                  style={{
                    padding: '20px 12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: j === 0 ? 'rgba(0,0,0,0.015)' : 'transparent',
                  }}
                >
                  {has ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="8.5" stroke="var(--text-primary)" strokeOpacity={j === 0 ? 1 : 0.25} />
                      <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke={j === 0 ? 'var(--text-primary)' : 'var(--text-secondary)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 16, color: 'var(--border)', fontWeight: 300 }}>—</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
