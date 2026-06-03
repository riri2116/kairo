import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function EmotionSimulator() {
  const points = [
    { x: 10, y: 50, label: "Excited", stage: "Discovery" },
    { x: 30, y: 80, label: "Confused", stage: "Onboarding" },
    { x: 50, y: 40, label: "Frustrated", stage: "Configuration" },
    { x: 70, y: 20, label: "Aha!", stage: "First Value" },
    { x: 90, y: 30, label: "Confident", stage: "Habit" }
  ];

  const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Simulate User Emotion</h2>
          <p className="color-secondary text-lg" style={{ maxWidth: 600, margin: '0 auto' }}>
            Map the emotional journey of your users before you build the UX.
          </p>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <div className="card" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <motion.path
                d={pathD}
                fill="none"
                stroke="var(--border)"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <motion.path
                d={pathD}
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {points.map((p, i) => (
                <g key={i}>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="1.5"
                    fill="var(--white)"
                    stroke="var(--text-primary)"
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (i * 0.3), duration: 0.5 }}
                  />
                  <motion.text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    fontSize="3"
                    fill="var(--text-primary)"
                    fontWeight="500"
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + (i * 0.3) }}
                  >
                    {p.label}
                  </motion.text>
                  <motion.text
                    x={p.x}
                    y={95}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill="var(--text-secondary)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + (i * 0.3) }}
                  >
                    {p.stage}
                  </motion.text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
