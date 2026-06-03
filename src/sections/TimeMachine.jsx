import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../components/FadeIn';

export default function TimeMachine() {
  const [activeTab, setActiveTab] = useState('90 Days');
  const tabs = ['30 Days', '90 Days', '1 Year', '3 Years'];
  
  const data = {
    '30 Days': { users: '4,200', rev: '$12k', ret: '42%' },
    '90 Days': { users: '18,500', rev: '$45k', ret: '58%' },
    '1 Year': { users: '145k', rev: '$320k', ret: '64%' },
    '3 Years': { users: '1.2M', rev: '$2.8M', ret: '71%' },
  };

  return (
    <section className="section container">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h2 className="text-3xl" style={{ marginBottom: 'var(--spacing-md)' }}>Product Time Machine</h2>
          <p className="color-secondary text-lg" style={{ maxWidth: 600, margin: '0 auto' }}>
            Fast-forward to see the compounding impact of your decisions over time.
          </p>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <div className="card" style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', gap: 8, padding: 4, background: 'rgba(0,0,0,0.03)', borderRadius: 100, marginBottom: 'var(--spacing-2xl)' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: activeTab === tab ? 'var(--white)' : 'transparent',
                  border: 'none',
                  borderRadius: 100,
                  fontSize: 14,
                  fontWeight: 500,
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-3 text-center">
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Projected Users</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + 'users'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ fontSize: 36, fontFamily: 'monospace' }}
                >
                  {data[activeTab].users}
                </motion.div>
              </AnimatePresence>
            </div>
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Projected MRR</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + 'rev'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ fontSize: 36, fontFamily: 'monospace' }}
                >
                  {data[activeTab].rev}
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Estimated Retention</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + 'ret'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ fontSize: 36, fontFamily: 'monospace' }}
                >
                  {data[activeTab].ret}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
