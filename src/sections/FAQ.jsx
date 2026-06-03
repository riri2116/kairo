import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function FAQ() {
  const faqs = [
    { q: "How is Kairo different from user research tools?", a: "Kairo uses predictive models based on millions of data points, simulating outcomes rather than just collecting self-reported user surveys." },
    { q: "Can Kairo integrate with our existing roadmap tools?", a: "Yes, we integrate seamlessly with Linear, Jira, Asana, and Notion to pull in your existing tasks and feature specs." },
    { q: "How accurate are Kairo's predictions?", a: "Our models achieve 87% accuracy on 6-month retention predictions when trained on historical product data." },
    { q: "Is our product data secure?", a: "Absolutely. We use enterprise-grade encryption and never train our base models on your proprietary data." },
    { q: "What does the free plan include?", a: "The free plan includes 5 feature simulations per month and access to the AI Boardroom for a single product." }
  ];

  return (
    <section className="section container" style={{ maxWidth: 800 }}>
      <FadeIn>
        <h2 className="text-3xl text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>Frequently Asked Questions</h2>
      </FadeIn>
      <div className="card" style={{ padding: '0 var(--spacing-lg)' }}>
        {faqs.map((faq, i) => (
          <details key={i} style={{ borderBottom: i === faqs.length - 1 ? 'none' : '1px solid var(--border)', padding: 'var(--spacing-md) 0' }}>
            <summary style={{ fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {faq.q}
              <span style={{ color: 'var(--text-secondary)' }}>+</span>
            </summary>
            <div style={{ paddingTop: 'var(--spacing-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
