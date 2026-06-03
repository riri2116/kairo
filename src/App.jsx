import React from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import AITerminal from './sections/AITerminal';
import ProductBrain from './sections/ProductBrain';
import Boardroom from './sections/Boardroom';
import EmotionSimulator from './sections/EmotionSimulator';
import TimeMachine from './sections/TimeMachine';
import DigitalUserCity from './sections/DigitalUserCity';
import CompetitorIntelligence from './sections/CompetitorIntelligence';
import FeatureImpactSandbox from './sections/FeatureImpactSandbox';
import Workflow from './sections/Workflow';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="app-wrapper">
      <Navigation />
      <main>
        <Hero />
        <AITerminal />
        <ProductBrain />
        <Boardroom />
        <EmotionSimulator />
        <TimeMachine />
        <DigitalUserCity />
        <CompetitorIntelligence />
        <FeatureImpactSandbox />
        <Workflow />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
