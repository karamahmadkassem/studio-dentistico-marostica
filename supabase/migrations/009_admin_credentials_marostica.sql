-- Replace default admin account with marostica user
INSERT INTO admin_users (username, password_hash) VALUES (
  'marostica',
  '$2b$12$SeM6QcM9ue59ct/ZJc71QemabdnlgkU/m7A5idvVcx2jCYYAJ2k12'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  failed_login_attempts = 0,
  locked_until = NULL;

DELETE FROM admin_users WHERE username = 'admin';
