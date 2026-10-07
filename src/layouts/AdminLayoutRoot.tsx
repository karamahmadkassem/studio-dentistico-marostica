import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayoutRoot: React.FC = () => (
  <Suspense fallback={<div className="p-8 text-ink-muted">Loading admin…</div>}>
    <Outlet />
  </Suspense>
);

export default AdminLayoutRoot;
