import React, { useState } from 'react';
import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import UserProfile from './UserProfile';
import NotificationsPanel from './NotificationsPanel';
import ThemeToggle from '../../components/ThemeToggle';

const PAGE_LABELS = {
  '/dashboard':                   'Overview',
  '/dashboard/products':          'Products',
  '/dashboard/product-brain':     'Product Brain',
  '/dashboard/boardroom':         'AI Boardroom',
  '/dashboard/emotion-simulator': 'Emotion Simulator',
  '/dashboard/competitors':       'Competitor Intelligence',
  '/dashboard/sandbox':           'Feature Sandbox',
  '/dashboard/roadmaps':          'Roadmaps',
  '/dashboard/requirements':      'Requirements',
  '/dashboard/analytics':         'Analytics',
  '/dashboard/settings':          'Settings',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const { workspaces, activeSlug } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const pageLabel = PAGE_LABELS[location.pathname] ?? 'Dashboard';
  const activeWorkspace = workspaces?.find(w => w.slug === activeSlug);
  const workspaceName = activeWorkspace?.name || 'Workspace';

  return (
    <>
      <header className="db-header">
        <button className="db-header-hamburger" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={18} />
        </button>

        <div className="db-breadcrumb">
          <span className="db-breadcrumb-workspace">{workspaceName}</span>
          <span className="db-breadcrumb-sep">/</span>
          <span className="db-breadcrumb-page">{pageLabel}</span>
        </div>

        <div className="db-header-search">
          <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span>Search...</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>⌘K</span>
        </div>

        <div className="db-header-actions">
          <ThemeToggle variant="icon" />

          <button
            className="db-icon-btn"
            onClick={() => setNotifOpen(o => !o)}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="db-notif-dot" />
          </button>

          <button className="db-icon-btn" aria-label="Help">
            <HelpCircle size={16} />
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

          <UserProfile />
        </div>
      </header>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
