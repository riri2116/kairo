import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useAuth } from './lib/auth';
import './dashboard.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" replace />;
  }

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
