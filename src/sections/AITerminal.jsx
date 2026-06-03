import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function AITerminal() {
  return (
    <section className="section container">
      <div className="grid grid-cols-2 items-center gap-2xl">
        <FadeIn>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Simulate decisions before you ship.</h2>
          <p className="color-secondary text-lg" style={{ marginBottom: 'var(--spacing-lg)' }}>
            Ask Kairo about any product decision. It runs thousands of simulations against your user data to predict outcomes and flag risks.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="card" style={{ background: '#111', color: 'white', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid #333', fontSize: 13, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ color: '#888', marginLeft: '12px' }}>Simulation Terminal</span>
            </div>
            
            <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <span style={{ color: '#888', marginRight: '8px' }}>→</span>
                <span style={{ fontFamily: 'monospace' }}>Should we launch AI flashcards?</span>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: 8, border: '1px solid #333' }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Retention Impact</div>
                    <div style={{ fontSize: 24, color: '#4ade80', fontFamily: 'monospace' }}>+23%</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: 8, border: '1px solid #333' }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Risk Score</div>
                    <div style={{ fontSize: 24, color: '#fbbf24', fontFamily: 'monospace' }}>Medium</div>
                  </div>
                </div>
                
                <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: 8, border: '1px solid #333' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Recommendation</div>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>
                    Strong engagement potential among power users. Development effort may exceed 3 sprints. Proceed with a phased beta rollout.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
