import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

function Band({ d, stroke, width, opacity, duration, delay, blur = 0 }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
      style={{ filter: blur ? `blur(${blur}px)` : 'none' }}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
    />
  );
}

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
        <svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMid meet" className="ribbon-svg" aria-hidden="true">
          <defs>
            <linearGradient id="rbBlue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
              <stop offset="22%" stopColor="#2563EB" stopOpacity="1" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.95" />
              <stop offset="78%" stopColor="#3B82F6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rbGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="28%" stopColor="#FBBF24" stopOpacity="1" />
              <stop offset="60%" stopColor="#FCD34D" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rbMix" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="30%" stopColor="#60A5FA" stopOpacity="0.9" />
              <stop offset="52%" stopColor="#FCD34D" stopOpacity="0.95" />
              <stop offset="74%" stopColor="#3B82F6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* soft glow underlay */}
          <Band
            d="M-40 150 C 200 60, 360 70, 540 140 S 860 210, 1040 120 S 1200 70, 1260 110"
            stroke="url(#rbGold)" width={70} opacity={0.4} duration={11} delay={0.2} blur={14}
          />
          <Band
            d="M-40 120 C 220 200, 380 200, 560 120 S 880 50, 1060 130 S 1220 180, 1260 130"
            stroke="url(#rbBlue)" width={70} opacity={0.4} duration={12} delay={0.5} blur={14}
          />

          {/* crisp ribbon bands */}
          <Band
            d="M-40 150 C 200 60, 360 70, 540 140 S 860 210, 1040 120 S 1200 70, 1260 110"
            stroke="url(#rbGold)" width={34} opacity={0.95} duration={9} delay={0} blur={1}
          />
          <Band
            d="M-40 120 C 220 200, 380 200, 560 120 S 880 50, 1060 130 S 1220 180, 1260 130"
            stroke="url(#rbBlue)" width={38} opacity={0.95} duration={10} delay={0.3} blur={1}
          />
          <Band
            d="M-40 135 C 210 110, 380 150, 560 130 S 880 120, 1060 125 S 1220 130, 1260 120"
            stroke="url(#rbMix)" width={20} opacity={0.9} duration={8} delay={0.15} blur={0}
          />
        </svg>

        <div className="ribbon-logos">
          {logos.map((name) => (
            <span key={name} className="ribbon-logo serif">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
