import React from 'react';
import kairoLogo from '../assets/kairo-logo.png';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: 'var(--spacing-xl) 0', background: 'var(--bg)' }}>
      <div className="container flex justify-between items-center">
        <div>
          <img src={kairoLogo} alt="Kairo" className="brand-logo-img" />
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Made in India 🇮🇳</div>
        </div>
        <div className="flex gap-lg">
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>Twitter</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>LinkedIn</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>Terms</a>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} Kairo Technologies Pvt. Ltd.</div>
      </div>
    </footer>
  );
}
