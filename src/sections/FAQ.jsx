import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function FAQ() {
  const faqs = [
    {
      q: "How is this different from user research tools?",
      a: "Research tools ask users what they think. Kairo simulates what users will actually do — based on behaviour patterns, not self-reported surveys. It's the difference between asking someone if they'd pay $50 for something and watching whether they reach for their wallet."
    },
    {
      q: "Can it connect to our existing tools?",
      a: "Yes — Kairo works with Linear, Jira, Asana, and Notion, so you can pull in your existing specs and roadmap items rather than starting from scratch."
    },
    {
      q: "How accurate are the predictions?",
      a: "On 6-month retention predictions, our models hit around 87% accuracy when trained on real product data. We always show a confidence score so you know how much weight to put on each result."
    },
    {
      q: "Is our data safe?",
      a: "Completely. Everything is encrypted at rest and in transit, and we never use your product data to train our base models. Your context stays yours."
    },
    {
      q: "What's free?",
      a: "The free plan gives you 5 feature simulations per month and access to the AI Boardroom for one product. Plenty to get a feel for whether it fits how your team works."
    }
  ];

  return (
    <section className="section container" style={{ maxWidth: 800 }}>
      <FadeIn>
        <h2 className="text-3xl text-center" style={{ marginBottom: 16 }}>A few questions we hear a lot</h2>
        <p className="text-center color-secondary" style={{ marginBottom: 'var(--spacing-xl)', fontSize: 16, lineHeight: 1.7 }}>
          If yours isn't here, just reach out — we're pretty quick to reply.
        </p>
      </FadeIn>
      <div className="card" style={{ padding: '0 var(--spacing-lg)' }}>
        {faqs.map((faq, i) => (
          <details key={i} style={{ borderBottom: i === faqs.length - 1 ? 'none' : '1px solid var(--border)', padding: 'var(--spacing-md) 0' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, gap: 16 }}>
              {faq.q}
              <span style={{ color: 'var(--text-secondary)', flexShrink: 0, fontSize: 18, fontWeight: 300 }}>+</span>
            </summary>
            <div style={{ paddingTop: 12, color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: 15 }}>{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
