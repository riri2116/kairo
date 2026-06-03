import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { Check } from 'lucide-react';

export default function CompetitorIntelligence() {
  const capabilities = [
    "Simulation",
    "Prediction",
    "Risk Analysis",
    "User Modeling"
  ];
  
  const competitors = [
    { name: "Kairo", isMain: true },
    { name: "Legacy BI", isMain: false },
    { name: "Survey Tools", isMain: false },
    { name: "Roadmap Planners", isMain: false }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Unmatched Intelligence</h2>
          <p className="color-secondary text-lg" style={{ maxWidth: 600, margin: '0 auto' }}>
            Why leading teams choose Kairo over traditional product management tools.
          </p>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
            <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}></div>
            {competitors.map((c, i) => (
              <div key={i} style={{ padding: 'var(--spacing-md)', textAlign: 'center', fontWeight: c.isMain ? 600 : 500, fontSize: 14, background: c.isMain ? 'var(--text-primary)' : 'transparent', color: c.isMain ? 'var(--white)' : 'var(--text-primary)' }}>
                {c.name}
              </div>
            ))}
          </div>
          
          {capabilities.map((cap, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i === capabilities.length - 1 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500, fontSize: 14 }}>
                {cap}
              </div>
              <div style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.02)' }}>
                <Check size={18} />
              </div>
              <div style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                {i > 1 ? '—' : <Check size={18} opacity={0.3} />}
              </div>
              <div style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                {i === 3 ? '—' : <Check size={18} opacity={0.3} />}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
