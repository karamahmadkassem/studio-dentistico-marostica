import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminLayout from './AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminCalendarPage from './pages/AdminCalendarPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminAboutPage from './pages/AdminAboutPage';
import AdminBlogPage from './pages/AdminBlogPage';
import AdminReviewsPage from './pages/AdminReviewsPage';

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="login" element={<AdminLoginPage />} />
    <Route
      element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }
    >
      <Route index element={<Navigate to="calendar" replace />} />
      <Route path="calendar" element={<AdminCalendarPage />} />
      <Route path="services" element={<AdminServicesPage />} />
      <Route path="about" element={<AdminAboutPage />} />
      <Route path="blog" element={<AdminBlogPage />} />
      <Route path="reviews" element={<AdminReviewsPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
