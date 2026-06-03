import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  Users,
  Target,
  FlaskConical,
  Map,
  FileText,
  BarChart2,
  Settings,
  X,
} from 'lucide-react';
import WorkspaceSwitcher from './WorkspaceSwitcher';

const NAV_ITEMS = [
  { label: 'Overview',                path: '/dashboard',                   icon: LayoutDashboard },
  { label: 'Product Brain',           path: '/dashboard/product-brain',     icon: Brain          },
  { label: 'AI Boardroom',            path: '/dashboard/boardroom',         icon: Users          },
  { label: 'Competitor Intelligence', path: '/dashboard/competitors',       icon: Target         },
  { label: 'Feature Sandbox',         path: '/dashboard/sandbox',           icon: FlaskConical   },
  { label: 'Roadmaps',                path: '/dashboard/roadmaps',          icon: Map            },
  { label: 'Requirements',            path: '/dashboard/requirements',      icon: FileText       },
  { label: 'Analytics',               path: '/dashboard/analytics',         icon: BarChart2      },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  function isActive(path) {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  }

  return (
    <>
      {open && <div className="db-sidebar-overlay open" onClick={onClose} />}

      <aside className={`db-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="db-sidebar-logo">
          <div className="db-sidebar-logo-mark">
            <span>K</span>
          </div>
          <span className="db-sidebar-logo-text">Kairo</span>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
            }}
            className="db-sidebar-close-btn"
          >
            <X size={15} />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="db-sidebar-workspace">
          <WorkspaceSwitcher />
        </div>

        <div className="db-sidebar-divider" />

        {/* Main navigation */}
        <span className="db-sidebar-section-label">Workspace</span>
        <nav className="db-sidebar-nav">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard'}
              className={({ isActive: routerActive }) =>
                `db-nav-item ${(path === '/dashboard' ? location.pathname === '/dashboard' : routerActive) ? 'active' : ''}`
              }
              onClick={() => { if (window.innerWidth <= 768) onClose(); }}
            >
              <Icon size={15} className="db-nav-icon" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom — Settings */}
        <div className="db-sidebar-bottom">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `db-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => { if (window.innerWidth <= 768) onClose(); }}
          >
            <Settings size={15} className="db-nav-icon" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
