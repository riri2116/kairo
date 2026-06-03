import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './dashboard.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="db-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="db-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="db-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
