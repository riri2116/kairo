import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

function Wave({ d, gradient, opacity, duration, delay, blur }) {
  return (
    <motion.path
      d={d}
      fill={gradient}
      opacity={opacity}
      style={{ filter: blur ? `blur(${blur}px)` : 'none' }}
      animate={{ x: [0, 20, 0], y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
    />
  );
}

export default function TrustRibbon() {
  const logos = ['aikido', 'Parim', 'LIVEFORCE', 'finbite', 'Parcel Tracker'];

  return (
    <section className="section container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
      <FadeIn>
        <p className="text-center color-secondary" style={{ fontSize: 14, marginBottom: 'var(--spacing-md)' }}>
          AI agents running tailored demos &amp; onboarding 24/7
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex justify-center" style={{ marginBottom: '-12px', position: 'relative', zIndex: 3 }}>
          <a href="/dashboard/login" className="btn btn-primary ribbon-demo-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3l4 4-4 4M11 7h8M19 13l-4 4 4 4M13 17H5" />
            </svg>
            See AI demo
          </a>
        </div>
      </FadeIn>

      <div className="ribbon-wrap">
        <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className="ribbon-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ribbonBlue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e63ff" stopOpacity="0" />
              <stop offset="20%" stopColor="#2f7bff" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#7fb0ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1e63ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ribbonGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffd36b" stopOpacity="0" />
              <stop offset="35%" stopColor="#ffc24a" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#ffe6a8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffd36b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ribbonBlend" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2f7bff" stopOpacity="0" />
              <stop offset="30%" stopColor="#5fa0ff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffd98a" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#2f7bff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#2f7bff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <Wave
            d="M-50 150 Q 200 40, 420 120 T 820 90 Q 1050 60, 1250 140 L 1250 220 L -50 220 Z"
            gradient="url(#ribbonGold)"
            opacity={0.9}
            duration={9}
            delay={0}
            blur={6}
          />
          <Wave
            d="M-50 120 Q 220 30, 460 110 T 880 80 Q 1080 50, 1250 120 L 1250 200 L -50 200 Z"
            gradient="url(#ribbonBlend)"
            opacity={0.85}
            duration={11}
            delay={0.4}
            blur={3}
          />
          <Wave
            d="M-50 100 Q 180 180, 440 110 T 860 130 Q 1060 160, 1250 100 L 1250 180 L -50 180 Z"
            gradient="url(#ribbonBlue)"
            opacity={0.95}
            duration={8}
            delay={0.2}
            blur={2}
          />
          <Wave
            d="M-50 90 Q 240 10, 500 90 T 900 70 Q 1090 40, 1250 95 L 1250 130 L -50 130 Z"
            gradient="url(#ribbonBlue)"
            opacity={0.6}
            duration={13}
            delay={0.8}
            blur={0}
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
