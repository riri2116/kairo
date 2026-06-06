import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function Hero() {
  return (
    <section className="section text-center container" style={{ paddingTop: '120px', paddingBottom: 0 }}>
      <FadeIn>
        <h1 className="text-5xl" style={{ maxWidth: '860px', margin: '0 auto var(--spacing-md)' }}>
          Figure out what works<br />before you build it.
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg color-secondary" style={{ maxWidth: '560px', margin: '0 auto var(--spacing-lg)', lineHeight: 1.75 }}>
          Kairo helps you pressure-test ideas, catch problems early, and go into every build with actual confidence — not just optimism.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="flex justify-center gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
          <a href="/dashboard/register" className="btn btn-primary">Get started free</a>
          <a href="#product" className="btn btn-ghost">See how it works</a>
        </div>
      </FadeIn>
    </section>
  );
}
