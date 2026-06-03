import React, { Suspense, lazy, Component } from 'react';
import { FadeIn } from '../components/FadeIn';

const RibbonScene = lazy(() => import('./RibbonScene'));

class RibbonBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* WebGL unavailable — silently fall back */
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function TrustRibbon() {
  return (
    <section className="ribbon-section">
      <div className="container">
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
      </div>

      <div className="ribbon-canvas-wrap" aria-hidden="true">
        <RibbonBoundary fallback={<div className="ribbon-fallback" />}>
          <Suspense fallback={<div className="ribbon-fallback" />}>
            <RibbonScene />
          </Suspense>
        </RibbonBoundary>
      </div>
    </section>
  );
}
