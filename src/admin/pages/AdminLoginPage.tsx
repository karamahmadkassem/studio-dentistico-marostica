import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ASSETS } from '../../config/assets';
import { adminLogin } from '../../lib/api';
import { useAdminSession } from '../../hooks/useAdminSession';
import { isSupabaseConfigured } from '../../lib/supabase';

const AdminLoginPage: React.FC = () => {
  const { authenticated, loading } = useAdminSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030D1D] text-white">
        Loading…
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/admin/calendar" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminLogin(username, password);
      navigate('/admin/calendar');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-form-panel">
        <div className="mx-auto w-full max-w-md">
          <p className="admin-login-brand">
            Studio Dentistico <span className="accent">Marostica</span>
          </p>
          <h1 className="heading-section mb-2 text-2xl">Admin Login</h1>
          <p className="mb-8 text-sm text-ink-muted">Sign in to manage the website</p>

          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="label-field">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="label-field">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-xs text-ink-muted">
            Default: admin / changeme — change after first login
          </p>
        </div>
      </div>

      <div className="admin-login-logo-panel">
        <img src={ASSETS.brand.logo} alt="Studio Dentistico Marostica" className="admin-login-logo" />
      </div>
    </div>
  );
};

export default AdminLoginPage;
