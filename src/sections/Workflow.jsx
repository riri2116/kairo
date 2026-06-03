import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function Workflow() {
  const steps = [
    { label: "Idea", icon: "💡" },
    { label: "Simulation", icon: "🧠" },
    { label: "Debate", icon: "💬" },
    { label: "Risk Analysis", icon: "🛡️" },
    { label: "Launch", icon: "🚀" }
  ];

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>The Intelligence Workflow</h2>
        </div>
      </FadeIn>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        {/* Connecting line */}
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
