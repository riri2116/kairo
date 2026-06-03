import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './dashboard/lib/auth';
import { ThemeProvider } from './lib/theme';

import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import AITerminal from './sections/AITerminal';
import AIDemo from './sections/AIDemo';
import ProductBrain from './sections/ProductBrain';
import EmotionSimulator from './sections/EmotionSimulator';
import TimeMachine from './sections/TimeMachine';
import DigitalUserCity from './sections/DigitalUserCity';
import CompetitorIntelligence from './sections/CompetitorIntelligence';
import FeatureImpactSandbox from './sections/FeatureImpactSandbox';
import Workflow from './sections/Workflow';
import TrustRibbon from './sections/TrustRibbon';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

import DashboardLayout from './dashboard/DashboardLayout';
import LoginPage from './dashboard/pages/LoginPage';
import RegisterPage from './dashboard/pages/RegisterPage';
import OverviewPage from './dashboard/pages/OverviewPage';
import ProductBrainPage from './dashboard/pages/ProductBrainPage';
import AIBoardroomPage from './dashboard/pages/AIBoardroomPage';
import EmotionSimulatorPage from './dashboard/pages/EmotionSimulatorPage';
import CompetitorPage from './dashboard/pages/CompetitorPage';
import FeatureSandboxPage from './dashboard/pages/FeatureSandboxPage';
import RoadmapsPage from './dashboard/pages/RoadmapsPage';
import RequirementsPage from './dashboard/pages/RequirementsPage';
import AnalyticsPage from './dashboard/pages/AnalyticsPage';
import SettingsPage from './dashboard/pages/SettingsPage';
import ProductsPage from './dashboard/pages/ProductsPage';
import ProductDetailPage from './dashboard/pages/ProductDetailPage';

function LandingPage() {
  return (
    <div className="app-wrapper">
      <Navigation />
      <main>
        <Hero />
        <TrustRibbon />
        <AIDemo />
        <AITerminal />
        <ProductBrain />
        <EmotionSimulator />
        <TimeMachine />
        <DigitalUserCity />
        <CompetitorIntelligence />
        <FeatureImpactSandbox />
        <Workflow />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard auth */}
          <Route path="/dashboard/login" element={<LoginPage />} />
          <Route path="/dashboard/register" element={<RegisterPage />} />

          {/* Dashboard (protected) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="products"              element={<ProductsPage />} />
            <Route path="products/:id"          element={<ProductDetailPage />} />
            <Route path="product-brain"         element={<ProductBrainPage />} />
            <Route path="boardroom"             element={<AIBoardroomPage />} />
            <Route path="emotion-simulator"     element={<EmotionSimulatorPage />} />
            <Route path="competitors"           element={<CompetitorPage />} />
            <Route path="sandbox"               element={<FeatureSandboxPage />} />
            <Route path="roadmaps"              element={<RoadmapsPage />} />
            <Route path="requirements"          element={<RequirementsPage />} />
            <Route path="analytics"             element={<AnalyticsPage />} />
            <Route path="settings"              element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}
