import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function CTA() {
  return (
    <section className="section text-center container" style={{ padding: '160px 0' }}>
      <FadeIn>
        <h2 className="text-5xl" style={{ marginBottom: 'var(--spacing-md)' }}>Every great product starts with a decision.</h2>
        <p className="text-lg color-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>Make better ones with Kairo.</p>
        <div className="flex justify-center gap-md">
          <a href="#" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>Start Free</a>
          <a href="#" className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: '16px' }}>Talk to Sales</a>
        </div>
      </FadeIn>
    </section>
  );
}
