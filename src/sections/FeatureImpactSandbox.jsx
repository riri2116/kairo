import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function FeatureImpactSandbox() {
  const [effort, setEffort] = useState(3);
  const [innovation, setInnovation] = useState(7);
  
  // Calculate fake metrics based on sliders for interactive feel
  const retention = Math.min(100, Math.floor(40 + (innovation * 4) - (effort * 1.5)));
  const revenue = Math.floor(10 + (innovation * 2.5) + (effort * 0.5));
  const engagement = Math.min(100, Math.floor(50 + (innovation * 3)));

  return (
    <section className="section container">
      <div className="grid grid-cols-2 gap-2xl items-center">
        <FadeIn>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Feature Impact Sandbox</h2>
          <p className="color-secondary text-lg" style={{ marginBottom: 'var(--spacing-lg)' }}>
            Tweak the parameters of your hypothetical feature and watch the projected outcomes update in real-time.
          </p>
          
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                <span>Development Effort</span>
                <span style={{ color: 'var(--text-secondary)' }}>{effort} Sprints</span>
              </div>
              <input 
                type="range" min="1" max="10" value={effort} onChange={(e) => setEffort(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--text-primary)' }}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                <span>Innovation Level</span>
                <span style={{ color: 'var(--text-secondary)' }}>{innovation}/10</span>
              </div>
              <input 
                type="range" min="1" max="10" value={innovation} onChange={(e) => setInnovation(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="card" style={{ background: '#111', color: 'white' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#888', marginBottom: 'var(--spacing-lg)' }}>Projected Outcomes</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span>Retention Lift</span>
                  <span style={{ fontFamily: 'monospace' }}>+{retention}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#333', borderRadius: 100, overflow: 'hidden' }}>
                  <motion.div 
                    animate={{ width: `${retention}%` }} 
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%', background: '#4ade80', borderRadius: 100 }} 
                  />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span>Revenue Impact</span>
                  <span style={{ fontFamily: 'monospace' }}>+${revenue}k MRR</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#333', borderRadius: 100, overflow: 'hidden' }}>
                  <motion.div 
                    animate={{ width: `${(revenue / 50) * 100}%` }} 
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%', background: '#60a5fa', borderRadius: 100 }} 
                  />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span>Engagement Score</span>
                  <span style={{ fontFamily: 'monospace' }}>{engagement}/100</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#333', borderRadius: 100, overflow: 'hidden' }}>
                  <motion.div 
                    animate={{ width: `${engagement}%` }} 
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%', background: '#fbbf24', borderRadius: 100 }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
