import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function Workflow() {
  const steps = [
    { label: "Your idea",    icon: "💡" },
    { label: "Simulation",   icon: "🧠" },
    { label: "Debate it",    icon: "💬" },
    { label: "Risk check",   icon: "🛡️" },
    { label: "Ship it",      icon: "🚀" }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>How it works</h2>
          <p className="color-secondary" style={{ fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            From a rough idea to a confident decision — usually in a few minutes.
          </p>
        </div>
      </FadeIn>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        <div style={{ position: 'absolute', top: 32, left: '50px', right: '50px', height: 1, background: 'var(--border)', zIndex: 0 }} />
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 'calc(100% - 100px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 32, left: '50px', height: 1, background: 'var(--text-primary)', zIndex: 1 }} 
        />
        
        {steps.map((step, i) => (
          <FadeIn key={i} delay={i * 0.3} className="text-center" style={{ position: 'relative', zIndex: 2, background: 'var(--bg)', padding: '0 8px' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', background: 'var(--white)', 
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: 24, margin: '0 auto var(--spacing-md)' 
            }}>
              {step.icon}
            </div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{step.label}</div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
