import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Kairo cut our pre-launch uncertainty from weeks to hours. It's like having a senior PM, a data scientist, and a market researcher — all in one place.",
      author: "Ananya Krishnan",
      role: "Head of Product, Setu"
    },
    {
      quote: "We ran 30 simulations before landing on our pricing model. Each one taught us something. It's now a core part of how we make decisions before any sprint starts.",
      author: "Rahul Joshi",
      role: "CPO, B2B SaaS startup, Pune"
    },
    {
      quote: "The Boardroom feature alone saved us from shipping a feature that would've hurt retention. We caught the problem before a single engineer touched it.",
      author: "Priya Iyer",
      role: "VP Product, Series B, Bengaluru"
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
