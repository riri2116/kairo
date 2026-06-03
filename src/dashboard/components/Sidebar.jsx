import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Brain,
  Users,
  Activity,
  Target,
  FlaskConical,
  Map,
  FileText,
  BarChart2,
  Settings,
  X,
} from 'lucide-react';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import kairoIcon from '../../assets/kairo-icon.png';

const NAV_ITEMS = [
  { label: 'Overview',                path: '/dashboard',                   icon: LayoutDashboard, exact: true },
  { label: 'Products',                path: '/dashboard/products',          icon: Package                     },
  { label: 'Product Brain',           path: '/dashboard/product-brain',     icon: Brain                       },
  { label: 'AI Boardroom',            path: '/dashboard/boardroom',         icon: Users                       },
  { label: 'Emotion Simulator',       path: '/dashboard/emotion-simulator', icon: Activity                    },
  { label: 'Competitor Intelligence', path: '/dashboard/competitors',       icon: Target                      },
  { label: 'Feature Sandbox',         path: '/dashboard/sandbox',           icon: FlaskConical                },
  { label: 'Roadmaps',                path: '/dashboard/roadmaps',          icon: Map                         },
  { label: 'Requirements',            path: '/dashboard/requirements',      icon: FileText                    },
  { label: 'Analytics',               path: '/dashboard/analytics',         icon: BarChart2                   },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {open && <div className="db-sidebar-overlay open" onClick={onClose} />}

      <aside className={`db-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="db-sidebar-logo" style={{ justifyContent: 'flex-start' }}>
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
        <span className="db-sidebar-section-label">Workspace</span>
        <nav className="db-sidebar-nav">
          {NAV_ITEMS.map(({ label, path, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) => `db-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => { if (window.innerWidth <= 768) onClose(); }}
            >
              <Icon size={15} className="db-nav-icon" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Settings at bottom */}
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
