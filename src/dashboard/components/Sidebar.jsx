import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Brain, Users, Activity,
  Target, FlaskConical, Map, FileText, BarChart2, Settings, X,
} from 'lucide-react';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import kairoIcon from '../../assets/kairo-icon.png';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview',  path: '/dashboard',          icon: LayoutDashboard, exact: true },
      { label: 'Products',  path: '/dashboard/products', icon: Package },
    ],
  },
  {
    label: 'AI Analysis',
    items: [
      { label: 'Product Brain',      path: '/dashboard/product-brain',     icon: Brain },
      { label: 'AI Boardroom',       path: '/dashboard/boardroom',         icon: Users },
      { label: 'Emotion Simulator',  path: '/dashboard/emotion-simulator', icon: Activity },
      { label: 'Feature Sandbox',    path: '/dashboard/sandbox',           icon: FlaskConical },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Competitors', path: '/dashboard/competitors', icon: Target },
      { label: 'Analytics',   path: '/dashboard/analytics',  icon: BarChart2 },
    ],
  },
  {
    label: 'Planning',
    items: [
      { label: 'Roadmaps',     path: '/dashboard/roadmaps',     icon: Map },
      { label: 'Requirements', path: '/dashboard/requirements', icon: FileText },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="db-sidebar-overlay open" onClick={onClose} />}

      <aside className={`db-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="db-sidebar-logo">
          <div className="db-sidebar-logo-mark">
            <img src={kairoIcon} alt="" />
          </div>
          <span className="db-sidebar-logo-text">Kairo</span>
          {open && (
            <button
              onClick={onClose}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Workspace Switcher */}
        <div className="db-sidebar-workspace">
          <WorkspaceSwitcher />
        </div>

        <div className="db-sidebar-divider" />

        {/* Navigation */}
        <nav className="db-sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="db-nav-section">
              <div className="db-sidebar-section-label">{section.label}</div>
              {section.items.map(({ label, path, icon: Icon, exact }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={exact}
                  className={({ isActive }) => `db-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => { if (window.innerWidth <= 768) onClose(); }}
                >
                  <Icon size={14} className="db-nav-icon" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="db-sidebar-bottom">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `db-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => { if (window.innerWidth <= 768) onClose(); }}
          >
            <Settings size={14} className="db-nav-icon" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
