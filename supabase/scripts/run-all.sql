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
-- Seed admin user (password: changeme — CHANGE IMMEDIATELY after first login)
-- bcrypt hash for 'changeme' cost 12
INSERT INTO admin_users (username, password_hash) VALUES (
  'admin',
  '$2b$12$8UxKFjUurxNQLeFtXiCAMObldgY1714zJjsTOJSvymh6sGfu5rKWm'
) ON CONFLICT (username) DO NOTHING;

INSERT INTO services (slug, icon_key, title_it, title_en, description_it, description_en, details_it, details_en, sort_order, published) VALUES
('general-dentistry', 'clipboard-check', 'Odontoiatria generale', 'General dentistry',
 'Prevenzione, cure conservative e trattamenti per mantenere denti e gengive in salute.',
 'Prevention, restorative care, and treatments to keep teeth and gums healthy.',
 '["Controlli periodici e prevenzione","Otturazioni estetiche in composito","Devitalizzazioni e endodonzia","Estrazioni semplici","Visite di urgenza"]',
 '["Regular check-ups and prevention","Aesthetic composite fillings","Root canal therapy and endodontics","Simple extractions","Emergency visits"]', 1, true),
('dental-hygiene', 'droplets', 'Igiene dentale', 'Dental hygiene',
 'Profilassi professionale e programmi personalizzati per un sorriso pulito e sano.',
 'Professional prophylaxis and personalised programmes for a clean, healthy smile.',
 '["Detartrasi e pulizia professionale","Lucidatura e rimozione delle macchie","Programmi di richiamo personalizzati","Educazione all''igiene orale","Prevenzione delle malattie gengivali"]',
 '["Scaling and professional cleaning","Polishing and stain removal","Personalised recall programmes","Oral hygiene education","Gum disease prevention"]', 2, true),
('gum-treatment', 'heart-pulse', 'Cura delle gengive', 'Gum treatment',
 'Diagnosi e terapie per gengiviti e parodontite, con follow-up dedicato.',
 'Diagnosis and therapy for gingivitis and periodontitis, with dedicated follow-up.',
 '["Diagnosi e trattamento delle gengiviti","Terapia parodontale non chirurgica","Levigatura radicolare","Chirurgia parodontale","Mantenimento parodontale"]',
 '["Diagnosis and treatment of gingivitis","Non-surgical periodontal therapy","Root planing","Periodontal surgery","Periodontal maintenance"]', 3, true),
('implants', 'bone', 'Implantologia', 'Implants',
 'Impianti osteointegrati e riabilitazioni fisse per sostituire i denti mancanti.',
 'Osseointegrated implants and fixed rehabilitations to replace missing teeth.',
 '["Impianti dentali in titanio","Protesi fisse su impianti","Pianificazione digitale","Riabilitazioni complete","All-on-4 e soluzioni su misura"]',
 '["Titanium dental implants","Fixed implant prosthetics","Digital planning","Full rehabilitations","All-on-4 and tailored solutions"]', 4, true),
('cosmetic-dentistry', 'gem', 'Odontoiatria estetica', 'Cosmetic dentistry',
 'Sbiancamento, faccette e ricostruzioni per armonizzare e valorizzare il sorriso.',
 'Whitening, veneers, and reconstructions to harmonise and enhance your smile.',
 '["Sbiancamento professionale","Faccette estetiche in ceramica","Ricostruzioni estetiche","Armonizzazione del sorriso","Risultati naturali e duraturi"]',
 '["Professional teeth whitening","Aesthetic ceramic veneers","Cosmetic reconstructions","Smile harmonisation","Natural, lasting results"]', 5, true),
('oral-surgery', 'scissors', 'Chirurgia orale', 'Oral surgery',
 'Interventi chirurgici mirati, inclusi denti del giudizio e procedure pre-protesiche.',
 'Targeted surgical procedures, including wisdom teeth and pre-prosthetic care.',
 '["Estrazione denti del giudizio","Estrazioni complesse","Chirurgia pre-protesica","Asportazione di cisti","Procedure mininvasive"]',
 '["Wisdom tooth extraction","Complex extractions","Pre-prosthetic surgery","Cyst removal","Minimally invasive procedures"]', 6, true),
('snoring-sleep-apnea', 'bed-double', 'Russamento e apnee notturne', 'Snoring & sleep apnea',
 'Valutazione e dispositivi personalizzati per migliorare il sonno e la respirazione notturna.',
 'Assessment and custom devices to improve sleep and nighttime breathing.',
 '["Valutazione del russamento","Dispositivi MAD personalizzati","Approccio multidisciplinare","Miglioramento della qualità del sonno","Follow-up e adattamento del dispositivo"]',
 '["Snoring assessment","Custom MAD devices","Multidisciplinary approach","Improved sleep quality","Device follow-up and adjustment"]', 7, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO about_sections (section_key, content) VALUES
('mission', '{"title_it":"La nostra missione","title_en":"Our mission","p1_it":"Forniamo cure odontoiatriche di alta qualità in un ambiente confortevole e accogliente.","p1_en":"We provide high-quality dental care in a comfortable, welcoming environment.","p2_it":"Crediamo nella prevenzione e nell''educazione del paziente.","p2_en":"We believe in prevention and patient education."}'),
('values', '{"items":[{"key":"excellence","title_it":"Eccellenza","title_en":"Excellence","desc_it":"Qualità elevata in ogni fase del percorso di cura.","desc_en":"High quality at every stage of care."},{"key":"integrity","title_it":"Integrità","title_en":"Integrity","desc_it":"Onestà e trasparenza nelle decisioni cliniche.","desc_en":"Honesty and transparency in clinical decisions."},{"key":"innovation","title_it":"Innovazione","title_en":"Innovation","desc_it":"Tecnologie e metodi aggiornati.","desc_en":"Updated technology and methods."},{"key":"empathy","title_it":"Empatia","title_en":"Empathy","desc_it":"Ascolto e comfort per ogni paziente.","desc_en":"Listening and comfort for every patient."}]}'),
('history', '{"items":[{"year":"2005","title_it":"Gli inizi","title_en":"The beginning","text_it":"Lo Studio nasce a Marostica.","text_en":"The practice was founded in Marostica."},{"year":"Oggi","title_it":"Punto di riferimento","title_en":"A trusted reference","text_it":"Riconosciuti per professionalità e innovazione.","text_en":"Known for professionalism and innovation."}]}'),
('team', '{"members":[{"name":"Dott. Alessandro Bianchi","role_it":"Direttore Sanitario | Odontoiatra","role_en":"Medical Director | Dentist","bio_it":"Specializzato in Implantologia e Chirurgia Orale.","bio_en":"Specialized in implantology and oral surgery.","image":"https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"},{"name":"Dott.ssa Maria Rossi","role_it":"Odontoiatra","role_en":"Dentist","bio_it":"Esperta in trattamenti per adulti e bambini.","bio_en":"Expert in treatments for adults and children.","image":"https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800"}]}'),
('technology', '{"title_it":"Tecnologia all''avanguardia","title_en":"Cutting-edge technology","content_it":"Investiamo in strumenti moderni per trattamenti precisi e confortevoli.","content_en":"We invest in modern tools for precise, comfortable treatments.","items_it":["Scanner intraorali digitali 3D","Radiografie digitali a bassa emissione","Sistemi CAD/CAM","Laser dentali minimamente invasivi"],"items_en":["3D intraoral scanners","Low-dose digital radiography","CAD/CAM systems","Minimally invasive dental lasers"]}')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO blog_categories (slug, name_it, name_en, sort_order) VALUES
('prevenzione', 'Prevenzione', 'Prevention', 1),
('implantologia', 'Implantologia', 'Implantology', 2),
('estetica', 'Estetica Dentale', 'Dental aesthetics', 3),
('alimentazione', 'Alimentazione', 'Nutrition', 4)
ON CONFLICT (slug) DO NOTHING;
-- Seed blog posts and published reviews; create blog images storage bucket

INSERT INTO blog_posts (slug, title_it, title_en, excerpt_it, excerpt_en, body_it, body_en, author, category_id, image_url, published, published_at)
SELECT
  'prevenzione-salute-orale',
  'L''importanza della prevenzione nella salute orale',
  'The importance of prevention in oral health',
  'La prevenzione è fondamentale per mantenere denti e gengive sani.',
  'Prevention is essential for healthy teeth and gums.',
  'La prevenzione resta il pilastro della salute orale.',
  'Prevention remains the cornerstone of oral health.',
  'Dott. Alessandro Bianchi',
  bc.id,
  'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=1200',
  true,
  '2025-05-15T10:00:00Z'
FROM blog_categories bc WHERE bc.slug = 'prevenzione'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title_it, title_en, excerpt_it, excerpt_en, body_it, body_en, author, category_id, image_url, published, published_at)
SELECT
  'implantologia-carico-immediato',
  'Implantologia a carico immediato: denti fissi in un giorno',
  'Immediate-load implantology: fixed teeth in one day',
  'Sostituire i denti mancanti in una sola seduta.',
  'Replace missing teeth in a single session.',
  'Protocolli avanzati e pianificazione digitale.',
  'Advanced protocols and digital planning.',
  'Dott. Roberto Verdi',
  bc.id,
  'https://images.pexels.com/photos/4269696/pexels-photo-4269696.jpeg?auto=compress&cs=tinysrgb&w=1200',
  true,
  '2025-04-10T10:00:00Z'
FROM blog_categories bc WHERE bc.slug = 'implantologia'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title_it, title_en, excerpt_it, excerpt_en, body_it, body_en, author, category_id, image_url, published, published_at)
SELECT
  'sbiancamento-miti-verita',
  'Sbiancamento dentale: miti e verità',
  'Teeth whitening: myths and facts',
  'Come ottenere un sorriso più bianco in sicurezza.',
  'How to brighten your smile safely.',
  'Lo sbiancamento professionale è sicuro ed efficace.',
  'Professional whitening is safe and effective.',
  'Dott. Alessandro Bianchi',
  bc.id,
  'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1200',
  true,
  '2025-04-02T10:00:00Z'
FROM blog_categories bc WHERE bc.slug = 'estetica'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO reviews (name, rating, treatment_type, body, status, helpful_count, created_at)
SELECT * FROM (VALUES
  ('Marco Rossi', 5, 'Implantologia', 'Ottimo studio dentistico! Il Dott. Bianchi è un professionista eccellente.', 'published'::review_status, 12, '2025-05-15T10:00:00Z'::timestamptz),
  ('Giulia Bianchi', 5, 'Estetica Dentale', 'Ho sempre avuto paura del dentista, ma qui mi sono sentita subito a mio agio.', 'published'::review_status, 8, '2025-04-28T10:00:00Z'::timestamptz),
  ('Luca Verdi', 4, 'Chirurgia Orale', 'Esperienza positiva per un intervento di estrazione del dente del giudizio.', 'published'::review_status, 6, '2025-04-10T10:00:00Z'::timestamptz),
  ('Sofia Russo', 5, 'Estetica Dentale', 'Ho fatto uno sbiancamento dentale e sono rimasta molto soddisfatta del risultato.', 'published'::review_status, 10, '2025-04-02T10:00:00Z'::timestamptz),
  ('Elena Martini', 5, 'Odontoiatria Pediatrica', 'Esperienza fantastica per la prima visita di mio figlio.', 'published'::review_status, 15, '2025-03-05T10:00:00Z'::timestamptz)
) AS v(name, rating, treatment_type, body, status, helpful_count, created_at)
WHERE NOT EXISTS (SELECT 1 FROM reviews LIMIT 1);

-- Storage bucket for blog images (public read)
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY blog_images_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Appointment cancellation (run once on existing databases)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_appointment_date_appointment_time_key;
CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_unique
  ON appointments (appointment_date, appointment_time)
  WHERE status <> 'cancelled';
