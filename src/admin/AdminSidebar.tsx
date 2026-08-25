import React from 'react';
import { NavLink } from 'react-router-dom';
import { ASSETS } from '../config/assets';
import {
  Calendar,
  Layers,
  Users,
  Newspaper,
  Star,
  LogOut,
} from 'lucide-react';
import { adminLogout } from '../lib/api';
import { useAdminNotifications } from './AdminNotificationsContext';

const navItems = [
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/services', label: 'Services', icon: Layers },
  { to: '/admin/about', label: 'About', icon: Users },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
];

const AdminSidebar: React.FC = () => {
  const { pendingCount } = useAdminNotifications();

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <img src={ASSETS.brand.logo} alt="" className="admin-sidebar-logo" />
        <span className="admin-sidebar-title">
          Admin <span className="accent">Panel</span>
        </span>
      </div>
      <nav className="admin-sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-sidebar-link${isActive ? ' admin-sidebar-link--active' : ''}`
            }
          >
            <Icon size={18} />
            {label}
            {to === '/admin/calendar' && pendingCount > 0 && (
              <span className="admin-sidebar-badge">{pendingCount}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <button type="button" onClick={handleLogout} className="admin-sidebar-logout">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
