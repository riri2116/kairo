import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function DigitalUserCity() {
  const segments = [
    { name: "Power Users", count: "12,450", color: "#111111", trend: "+12%" },
    { name: "Active Users", count: "45,800", color: "#444444", trend: "+5%" },
    { name: "At-Risk", count: "3,200", color: "#fbbf24", trend: "-2%" },
    { name: "Churned", count: "1,150", color: "#ff5f56", trend: "-8%" }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Digital User City</h2>
          <p className="color-secondary text-lg" style={{ maxWidth: 600, margin: '0 auto' }}>
            A living map of your user ecosystem. See how segments shift in real-time based on your simulated decisions.
          </p>
        </div>
      </FadeIn>
      
      <div className="grid grid-cols-4">
        {segments.map((segment, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: segment.color }} />
                {segment.name}
              </div>
              <div style={{ fontSize: 32, fontFamily: 'monospace', fontWeight: 300, marginBottom: 'var(--spacing-lg)' }}>
                {segment.count}
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Expected Shift</span>
                <span style={{ fontWeight: 500, color: segment.trend.startsWith('+') ? '#27c93f' : segment.trend === '-8%' ? '#27c93f' : '#ff5f56' }}>
                  {segment.trend}
                </span>
              </div>
              
              {/* Subtle background pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.05, 0.02] }}
                transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: segment.color,
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              />
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
