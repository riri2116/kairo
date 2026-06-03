import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { motion } from 'framer-motion';

export default function Boardroom() {
  const personas = [
    { role: 'Founder', quote: 'This aligns with our 10-year vision.', initials: 'FR' },
    { role: 'CTO', quote: 'We’d need 3 sprints minimum.', initials: 'CT' },
    { role: 'Growth PM', quote: 'Massive acquisition opportunity.', initials: 'GP' },
    { role: 'UX Researcher', quote: 'Users tested this. They love it.', initials: 'UX' },
    { role: 'Finance Lead', quote: 'ROI projections look strong at 18 months.', initials: 'FL' }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>The AI Boardroom</h2>
          <p className="color-secondary text-lg" style={{ maxWidth: 600, margin: '0 auto' }}>
            Watch AI personas debate your features from different stakeholder perspectives.
          </p>
        </div>
      </FadeIn>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {personas.map((p, i) => (
          <FadeIn key={i} delay={0.1 * i}>
            <div className="card" style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', padding: 'var(--spacing-md) var(--spacing-lg)' }}>
              <div className="avatar" style={{ flexShrink: 0 }}>{p.initials}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.role}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 16 }}>"{p.quote}"</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
