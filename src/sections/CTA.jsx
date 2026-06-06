import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function CTA() {
  return (
    <section className="section text-center container" style={{ padding: '160px 0' }}>
      <FadeIn>
        <h2 className="text-5xl" style={{ marginBottom: 'var(--spacing-md)' }}>
          Stop shipping guesses.
        </h2>
        <p className="text-lg color-secondary" style={{ marginBottom: 'var(--spacing-lg)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto var(--spacing-lg)' }}>
          Most product decisions are made on gut feel and deadlines. Kairo gives you a better option.
        </p>
        <div className="flex justify-center gap-md">
          <a href="/dashboard/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>Start for free</a>
          <a href="/dashboard/login" className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: '16px' }}>Talk to us</a>
        </div>
      </FadeIn>
    </section>
  );
}
