-- Studio Dentistico Marostica — initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin (single clinic account)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Opening hours (0 = Sunday … 6 = Saturday)
CREATE TABLE opening_hours (
  day_of_week SMALLINT PRIMARY KEY CHECK (day_of_week BETWEEN 0 AND 6),
  is_closed BOOLEAN NOT NULL DEFAULT false,
  open_time TIME,
  close_time TIME,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services CMS
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  icon_key TEXT NOT NULL DEFAULT 'smile',
  title_it TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_it TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  details_it JSONB NOT NULL DEFAULT '[]',
  details_en JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- About sections (JSON per section key)
CREATE TABLE about_sections (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_it TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_it TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_it TEXT NOT NULL DEFAULT '',
  excerpt_en TEXT NOT NULL DEFAULT '',
  body_it TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments
CREATE TYPE appointment_status AS ENUM ('pending', 'accepted', 'review_sent', 'cancelled');

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL DEFAULT '',
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  message TEXT,
  status appointment_status NOT NULL DEFAULT 'pending',
  cancellation_reason TEXT,
  locale TEXT NOT NULL DEFAULT 'it',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX appointments_active_slot_unique
  ON appointments (appointment_date, appointment_time)
  WHERE status <> 'cancelled';

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Reviews
CREATE TYPE review_status AS ENUM ('pending', 'published', 'archived');

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  treatment_type TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'pending',
  helpful_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE review_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- Admin sessions (JWT alternative store)
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Default opening hours (Mon–Fri 9–19, Sat 9–13, Sun closed)
INSERT INTO opening_hours (day_of_week, is_closed, open_time, close_time) VALUES
  (0, true, NULL, NULL),
  (1, false, '09:00', '19:00'),
  (2, false, '09:00', '19:00'),
  (3, false, '09:00', '19:00'),
  (4, false, '09:00', '19:00'),
  (5, false, '09:00', '19:00'),
  (6, false, '09:00', '13:00');

-- RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_invitations ENABLE ROW LEVEL SECURITY;

-- Public read: published content only
CREATE POLICY services_public_read ON services FOR SELECT USING (published = true);
CREATE POLICY about_public_read ON about_sections FOR SELECT USING (true);
CREATE POLICY blog_categories_public_read ON blog_categories FOR SELECT USING (true);
CREATE POLICY blog_posts_public_read ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY reviews_public_read ON reviews FOR SELECT USING (status = 'published');
CREATE POLICY opening_hours_public_read ON opening_hours FOR SELECT USING (true);

-- Appointments: public can read dates/times only for availability (via edge function with service role)
-- No direct public write policies — all writes via Edge Functions

-- Storage bucket for blog images (run via dashboard or separate migration)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
