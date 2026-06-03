import React, { useState } from 'react';
import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import NotificationsPanel from './NotificationsPanel';

const PAGE_LABELS = {
  '/dashboard':              'Overview',
  '/dashboard/product-brain':'Product Brain',
  '/dashboard/boardroom':    'AI Boardroom',
  '/dashboard/competitors':  'Competitor Intelligence',
  '/dashboard/sandbox':      'Feature Sandbox',
  '/dashboard/roadmaps':     'Roadmaps',
  '/dashboard/requirements': 'Requirements',
  '/dashboard/analytics':    'Analytics',
  '/dashboard/settings':     'Settings',
};

const MOCK_WORKSPACE_NAME = 'Acme Corp';
const UNREAD_COUNT = 3;

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  const pageLabel = PAGE_LABELS[location.pathname] ?? 'Dashboard';

  return (
    <>
      <header className="db-header">
        {/* Hamburger (mobile) */}
        <button className="db-header-hamburger" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="db-breadcrumb">
          <span className="db-breadcrumb-workspace">{MOCK_WORKSPACE_NAME}</span>
          <span className="db-breadcrumb-sep">/</span>
          <span className="db-breadcrumb-page">{pageLabel}</span>
        </div>

        {/* Search */}
        <div className="db-header-search">
          <Search size={13} style={{ color: '#aaa', flexShrink: 0 }} />
          <span>Search...</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#ccc', fontFamily: 'monospace' }}>⌘K</span>
        </div>

        {/* Actions */}
        <div className="db-header-actions">
          <button
            className="db-icon-btn"
            onClick={() => setNotifOpen(o => !o)}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {UNREAD_COUNT > 0 && <span className="db-notif-dot" />}
          </button>

          <button className="db-icon-btn" aria-label="Help">
            <HelpCircle size={16} />
          </button>

          <div style={{ width: 1, height: 20, background: '#E5E4E0', margin: '0 4px' }} />

          <UserProfile />
        </div>
      </header>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
