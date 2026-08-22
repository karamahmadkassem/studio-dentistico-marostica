import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { AdminNotificationsProvider } from './AdminNotificationsContext';

const AdminLayout: React.FC = () => {
  return (
    <AdminNotificationsProvider>
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </AdminNotificationsProvider>
  );
};

export default AdminLayout;
