import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

import DashboardLayout from './dashboard/DashboardLayout';
import OverviewPage from './dashboard/pages/OverviewPage';
import ProductBrainPage from './dashboard/pages/ProductBrainPage';
import AIBoardroomPage from './dashboard/pages/AIBoardroomPage';
import CompetitorPage from './dashboard/pages/CompetitorPage';
import FeatureSandboxPage from './dashboard/pages/FeatureSandboxPage';
import RoadmapsPage from './dashboard/pages/RoadmapsPage';
import RequirementsPage from './dashboard/pages/RequirementsPage';
import AnalyticsPage from './dashboard/pages/AnalyticsPage';
import SettingsPage from './dashboard/pages/SettingsPage';

function LandingPage() {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="product-brain"  element={<ProductBrainPage />} />
          <Route path="boardroom"      element={<AIBoardroomPage />} />
          <Route path="competitors"    element={<CompetitorPage />} />
          <Route path="sandbox"        element={<FeatureSandboxPage />} />
          <Route path="roadmaps"       element={<RoadmapsPage />} />
          <Route path="requirements"   element={<RequirementsPage />} />
          <Route path="analytics"      element={<AnalyticsPage />} />
          <Route path="settings"       element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
