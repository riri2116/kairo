import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function ProductBrain() {
  return (
    <section className="section container">
      <div className="grid grid-cols-2 items-center gap-2xl">
        <FadeIn className="order-2-mobile">
          <div className="card" style={{ padding: 'var(--spacing-xl)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Prediction Confidence</div>
              <div style={{ fontSize: 48, fontWeight: 300, fontFamily: 'monospace' }}>82.4%</div>
            </div>
            
            <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 'var(--spacing-lg)' }}>
              {[40, 60, 45, 80, 55, 90, 75, 100, 85].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.05), duration: 0.8, ease: "easeOut" }}
                  style={{
                    flex: 1,
                    background: i === 7 ? 'var(--text-primary)' : 'var(--border)',
                    borderRadius: '4px 4px 0 0'
                  }}
                />
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Predicted MAU</div>
                <div style={{ fontSize: 20, fontWeight: 500, marginTop: 4 }}>+12,400</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Revenue Impact</div>
                <div style={{ fontSize: 20, fontWeight: 500, marginTop: 4 }}>+$45k MRR</div>
              </div>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn className="order-1-mobile">
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Predict outcomes before writing code.</h2>
          <p className="color-secondary text-lg" style={{ marginBottom: 'var(--spacing-lg)' }}>
            Kairo's product brain analyzes your historical data, market trends, and competitor movements to build highly accurate probability models for your roadmap.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[
              "Market fit probability scoring",
              "Resource vs ROI optimization",
              "Cannibalization risk detection"
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
