import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function Hero() {
  return (
    <section className="section text-center container" style={{ paddingTop: '120px' }}>
      <FadeIn>
        <h1 className="text-5xl" style={{ maxWidth: '900px', margin: '0 auto var(--spacing-md)' }}>
          The Intelligence OS for Product Teams
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="text-lg color-secondary" style={{ maxWidth: '600px', margin: '0 auto var(--spacing-lg)' }}>
          Simulate product decisions, predict outcomes, uncover risks, and build products with confidence before writing a single line of code.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="flex justify-center gap-md" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <a href="#" className="btn btn-primary">Start Free</a>
          <a href="#" className="btn btn-ghost">Watch Demo</a>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <div className="hero-diagram card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Core Hub */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], boxShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 40px rgba(0,0,0,0.1)', '0px 0px 0px rgba(0,0,0,0)'] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 2, position: 'relative' }}
          >
            <span className="serif" style={{ fontSize: '24px' }}>Kairo</span>
          </motion.div>
          
          {/* Orbiting nodes */}
          {[
            { label: 'Users', angle: 0, distance: 150 },
            { label: 'Revenue', angle: 60, distance: 180 },
            { label: 'Retention', angle: 120, distance: 160 },
            { label: 'Roadmap', angle: 180, distance: 140 },
            { label: 'Features', angle: 240, distance: 170 },
            { label: 'Insights', angle: 300, distance: 150 },
          ].map((node, i) => {
            const x = Math.cos(node.angle * (Math.PI / 180)) * node.distance;
            const y = Math.sin(node.angle * (Math.PI / 180)) * node.distance;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, x, y }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 1, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  padding: '8px 16px',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}
              >
                {node.label}
              </motion.div>
            )
          })}
        </div>
      </FadeIn>
    </section>
  );
}
