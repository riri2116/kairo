import React from 'react';
import { FadeIn } from '../components/FadeIn';

export default function TrustRibbon() {
  const logos = ['aikido', 'Parim', 'LIVEFORCE', 'finbite', 'Parcel Tracker'];

  return (
    <section className="section container ribbon-section">
      <FadeIn>
        <p className="text-center color-secondary" style={{ fontSize: 14, marginBottom: 'var(--spacing-md)' }}>
          AI agents running tailored demos &amp; onboarding 24/7
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex justify-center" style={{ position: 'relative', zIndex: 3 }}>
          <a href="/dashboard/login" className="btn btn-primary ribbon-demo-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3l4 4-4 4M11 7h8M19 13l-4 4 4 4M13 17H5" />
            </svg>
            See AI demo
          </a>
        </div>
      </FadeIn>

      <div className="ribbon-wrap">
        <svg className="ribbon-filter-defs" aria-hidden="true" focusable="false">
          <defs>
            <filter id="ribbonWave" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="2" seed="4" result="noise">
                <animate attributeName="baseFrequency" dur="16s" values="0.008 0.016; 0.013 0.011; 0.008 0.016" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <img src="/ribbon-wave.png" alt="" aria-hidden="true" className="ribbon-img" />

        <div className="ribbon-logos">
          {logos.map((name) => (
            <span key={name} className="ribbon-logo serif">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
