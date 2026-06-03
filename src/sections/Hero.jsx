import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function Hero() {
  return (
    <section className="section text-center container" style={{ paddingTop: '120px', paddingBottom: 0 }}>
      <FadeIn>
        <h1 className="text-5xl" style={{ maxWidth: '900px', margin: '0 auto var(--spacing-md)' }}>
          The Intelligence OS for Product Teams
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg color-secondary" style={{ maxWidth: '600px', margin: '0 auto var(--spacing-lg)' }}>
          Simulate product decisions, predict outcomes, uncover risks, and build products with confidence before writing a single line of code.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="flex justify-center gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
          <a href="/dashboard/login" className="btn btn-primary">Start Free</a>
          <a href="#product" className="btn btn-ghost">Watch Demo</a>
        </div>
      </FadeIn>
    </section>
  );
}
