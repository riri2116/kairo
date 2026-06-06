import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Kairo cut our pre-launch uncertainty from weeks to hours. It's like having a senior PM, a data scientist, and a UX researcher — all in one place.",
      author: "Maya Chen",
      role: "Head of Product, Loom"
    },
    {
      quote: "We ran 40 simulations before landing on our pricing model. Every one of them taught us something. It's become a core part of how we make decisions.",
      author: "James Park",
      role: "CPO, fintech startup"
    },
    {
      quote: "The AI Boardroom alone saved us from shipping a feature that would've hurt retention. We caught it before a single sprint started.",
      author: "Priya Nair",
      role: "VP Product, Series B"
    }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <h2 className="text-3xl text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>What teams are saying</h2>
      </FadeIn>
      <div className="grid grid-cols-3">
        {testimonials.map((t, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="serif" style={{ fontSize: '22px', lineHeight: 1.5, marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
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
