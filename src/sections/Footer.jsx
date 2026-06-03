import React from 'react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: 'var(--spacing-xl) 0', background: 'var(--bg)' }}>
      <div className="container flex justify-between items-center">
        <div className="serif text-xl">Kairo</div>
        <div className="flex gap-lg">
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>Twitter</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>LinkedIn</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>Terms</a>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} Kairo Inc.</div>
      </div>
    </footer>
  );
}
