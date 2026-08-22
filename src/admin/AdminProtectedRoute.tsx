import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminSession } from '../hooks/useAdminSession';

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const { loading, authenticated } = useAdminSession();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030D1D] text-white">
        <p className="text-sm text-white/70">Loading…</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
