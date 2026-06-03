import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Kairo cut our pre-launch uncertainty from weeks to hours. It's like having a senior PM, a data scientist, and a UX researcher all in one.",
      author: "Maya Chen",
      role: "Head of Product, Loom"
    },
    {
      quote: "We ran 40 simulations before deciding on our pricing model. Every one was insightful. Kairo is the unfair advantage we didn't know we needed.",
      author: "James Park",
      role: "CPO, Fintech startup"
    },
    {
      quote: "The AI Boardroom feature alone saved us from shipping a feature that would have hurt retention. ROI in the first week.",
      author: "Priya Nair",
      role: "VP Product, Series B SaaS"
    }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <h2 className="text-3xl text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>Trusted by elite product teams</h2>
      </FadeIn>
      <div className="grid grid-cols-3">
        {testimonials.map((t, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="serif" style={{ fontSize: '24px', lineHeight: 1.4, marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                "{t.quote}"
              </p>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.author}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t.role}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
